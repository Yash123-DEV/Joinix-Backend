import { customAlphabet } from "nanoid";

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12);

export const generateRoomId = () => nanoid();