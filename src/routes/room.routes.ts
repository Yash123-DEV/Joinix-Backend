// src/routes/room.routes.ts
import express, { Request, Response, NextFunction } from "express";
import { handleCreateRoom, handleGetRoom, handleJoinRoom } from '../controllers/room.controller';

const router = express.Router();

router.post('/create', (req: Request, res: Response, next: NextFunction) => {
    handleCreateRoom( req, res, next);
});
router.get('/:roomId', (req: Request, res: Response, next: NextFunction) => {
    handleGetRoom( req, res, next);
});

router.post('/join', (req: Request, res: Response, next: NextFunction) => {
    handleJoinRoom(req, res, next);
});



export default router;
