
import mongoose,{Schema, model} from "mongoose";


const roomSchema = new mongoose.Schema({
    roomId: {type: String, required: true, unique: true},
    hostUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
});

export const Room = mongoose.model('Room', roomSchema); 