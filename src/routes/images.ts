import { Router } from "express";
import imagesController from "@ms/controllers/images"

const router = Router();

router.get("/files", imagesController.getImages);

export default router;