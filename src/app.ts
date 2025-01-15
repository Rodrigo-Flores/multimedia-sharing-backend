import express from "express";
import dotenv from "dotenv";
//
import api from "@ms/routes/api";
import imagesRouter from '@ms/routes/images';


//varaiobles de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 2025;

// Middleware
app.use(express.json());

//config de rutas
app.use("/api", api);
app.use("/api/images", imagesRouter);

//inicializa el server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});