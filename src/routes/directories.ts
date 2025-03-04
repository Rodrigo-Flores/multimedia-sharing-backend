import { Router } from "express";
import directoriesController from "@ms/controllers/directories";

const router = Router();

router.get("/", directoriesController.getDirectories);

export default router;