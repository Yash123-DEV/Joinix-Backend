
import mongoose from 'mongoose'

export const connectDB = async () => {
    try{
        console.log("MONGO_URI:", process.env.MONGO_URI);  // 👈 Add this
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected successfully');
    }catch(error){
        console.error(error);
        process.exit(1); // Exit the process with failure
    }
}