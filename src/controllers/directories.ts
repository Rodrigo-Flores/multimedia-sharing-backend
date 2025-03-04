import { Request, Response } from 'express';
import path from 'path';
import Disk from "@ms/utils/disk";

const getDirectories = async (req: Request, res: Response) => {
  const disk = new Disk(req.query.path ? path.resolve(req.query.path.toString()) : path.resolve('./'));

  try {
    const directories = disk.getDirectories();
    res.status(200).json({ data: directories });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}

export default {
  getDirectories,
};