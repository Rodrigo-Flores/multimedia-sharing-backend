import { Request, Response } from 'express';
import path from 'path';
//
import Disk from "@ms/utils/disk";

const getFiles = async (req: Request, res: Response) => {
  const disk = new Disk(req.query.path ? path.resolve(req.query.path.toString()) : path.resolve('./'));

  const search = req.query.search?.toString();
  const sort = req.query.sort === 'desc' ? 'desc' : 'asc';
  const createdAtOrder = req.query.createdAt ? req.query.createdAt.toString() : '';

  try {
    const files = disk.getFiles(disk.basePath, search, sort, createdAtOrder);

    res.status(200).json({ files });

  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}

export default {
  getFiles,
}