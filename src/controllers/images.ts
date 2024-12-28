import { Request, Response } from 'express';
import Drive from "@ms/utils/drive";

const getImages = async (req: Request, res: Response) => {
  const drive = new Drive();
  const files = drive.getFiles();
  console.log(files);
  res.json({ message: "Hello from images controller" });
}

export default {
  getImages
}