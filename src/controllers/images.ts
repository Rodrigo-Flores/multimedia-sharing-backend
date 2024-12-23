import { Request, Response } from 'express';

const getImages = async (req: Request, res: Response) => {
  res.json({ message: "Hello from images controller" });
}

export default {
  getImages
}