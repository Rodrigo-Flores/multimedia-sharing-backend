import express from "express";
//
import imagesRoutes from "./files";

const router = express.Router();

router.use("/images", imagesRoutes);

export default router;