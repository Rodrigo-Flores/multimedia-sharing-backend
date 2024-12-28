import express from "express";
import dotenv from "dotenv";
//
import api from "@ms/routes/api";

dotenv.config();

const app = express();
const port = process.env.PORT || 2025;

app.use(express.json());

app.use("/api", api);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});