import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../model/user.model';


export const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body;

    try {
        const existUser = await User.findOne(email ? {email} : {username});
        if (existUser) {
            return res.status(400).json({message: "User already exists"});
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message : "User Registered Successfully",
            userId : newUser._id,
        });


    }catch (error) {
        console.error("SignUp error", error);
        return res.status(500).json({ message: "Internal Server Error" }); // check this point 
    }

    
}



export const userSignIn = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message : "user does not exist"});
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if(!isMatchPassword) {
            return res.status(401).json({message : "invalid credentials"});
        }

        const secretKey = process.env.SecretKey;
        if (!secretKey) {
            throw new Error("JWT SecretKey is not defined in environment variables");
        }
        const token = jwt.sign(
            {id : user._id},
            secretKey,
            {expiresIn: "30d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
            id: user._id,
            email: user.email,
            username: user.username,
      },

    });

    }catch (error) {
        console.error("SignIn Error", error);
        return res.status(500).json({ message: "Internal Server Error while SignIn" });
    }
}

export const GetCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SecretKey!) as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        });
    }catch (error) {
        console.error("GetCurrentUser Error", error);
        return res.status(401).json({ message: "Invalid token" });
    }
}