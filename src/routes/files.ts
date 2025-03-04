import { Router } from "express";
import filesController from "@ms/controllers/files";

const router = Router();

router.get("/", filesController.getFiles);

export default router;