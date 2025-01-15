import { Request, Response } from 'express';
import path from 'path';
import Disk from "@ms/utils/disk";

const getImages = async (req: Request, res: Response) => {
  //crea instancia de Disk
  const disk = new Disk();

  //lee parámetros de la solicitud
  const directoryPath = req.query.path ? path.resolve(req.query.path.toString()) : path.resolve('./'); //directorio actual por defecto
  const search = req.query.search?.toString();
  const sort = req.query.sort === 'desc' ? 'desc' : 'asc'; //orden asc por defecto
  const createdAtOrder = req.query.createdAt ? req.query.createdAt.toString() : ''; //por fecha

  try {
    //se llama el método con sus parámetros
    const files = disk.getFiles(directoryPath, search, sort, createdAtOrder);

    //devuelve los archivos
    res.status(200).json({ files });

  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}

export default {
  getImages,
}