import {Room} from "../model/room.model";
import { generateRoomId } from "../utils/generateRoomId";

const FRONTEND_BASE_URL = process.env.FRONTEND_URL || 'https://joinix-vecg.onrender.com/';


export const createRoom = async (hostUserId: string) => {
    let roomId: string = "";
    let isUnique = false;

    let tries = 0;
    while (!isUnique && tries < 5) {
        roomId = generateRoomId();
        const exists = await Room.findOne({ roomId });
        if (!exists) isUnique = true;
        tries++;
    }

    if (!isUnique) throw new Error("Failed to generate unique room ID");

    const room = await Room.create({ roomId, hostUserId});

    return {
        roomId,
        joinLink: `${FRONTEND_BASE_URL}/room/${roomId}`,
        hostUserId: room.hostUserId,
        createdAt: room.createdAt,
    }
}

export const getRoomById = async (roomId: string) => {
  return await Room.findOne({ roomId });
};