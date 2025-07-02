import express, { Request, Response, NextFunction } from "express";
import { userSignUp, userSignIn, GetCurrentUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  userSignUp(req, res, next);
});
router.post("/signin", (req: Request, res: Response, next: NextFunction) => {
  userSignIn(req, res, next);
});

router.get("/me", (req : Request, res: Response, next: NextFunction) => {
  GetCurrentUser(req, res, next);
})

export default router;
