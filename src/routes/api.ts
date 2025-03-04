import express from "express";
//
import fileRoutes from "./files";
import directoryRoutes from "./directories";

const router = express.Router();

router.use("/files", fileRoutes);
router.use("/directories", directoryRoutes);

export default router;