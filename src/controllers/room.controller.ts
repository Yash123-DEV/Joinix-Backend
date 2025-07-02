import { Request, Response, NextFunction } from 'express';
import { createRoom, getRoomById } from '../services/room.service';
import { Room } from '../model/room.model';

export const handleCreateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const room = await createRoom(userId);
        return res.status(201).json(room);
    }catch (error) {
        console.error('Error creating room:', error);
        return res.status(500).json({ error: 'Failed to create room' });
    }
}

export const handleGetRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            return res.status(400).json({ error: 'Room ID is required' });
        }

        const room = await getRoomById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        return res.status(200).json(room);
    } catch (error) {
        console.error('Error fetching room:', error);
        return res.status(500).json({ error: 'Failed to fetch room' });
    }
}

export const handleJoinRoom = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    return res.status(200).json({ message: "Joined successfully" });
  } catch (err) {
    console.error("Join room error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
