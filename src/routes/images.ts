import { Router } from "express";
import imagesController from "@ms/controllers/files"

const router = Router();

router.get("/files", imagesController.getFiles);

export default router;