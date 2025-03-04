import express from "express";
import dotenv from "dotenv";
//
import logger, { colors } from "@ms/utils/logger";
import api from "@ms/routes/api";
import imagesRouter from '@ms/routes/files';

dotenv.config();

const app = express();
const port = process.env.PORT || 2025;

const HTTP_METHOD_COLORS = {
  GET: colors.green,
  POST: colors.blue,
  PUT: colors.yellow,
  PATCH: colors.yellow,
  DELETE: colors.red,
  DEFAULT: colors.white,
};

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    const methodColor = HTTP_METHOD_COLORS[req.method as keyof typeof HTTP_METHOD_COLORS] || HTTP_METHOD_COLORS.DEFAULT;

    const statusColor = res.statusCode >= 500 ? colors.red :
      res.statusCode >= 400 ? colors.yellow :
        res.statusCode >= 300 ? colors.cyan :
          colors.green;

    logger.info(
      `${methodColor}${req.method}${colors.reset} ${req.originalUrl} - ` + `${statusColor}${res.statusCode}${colors.reset} [${duration}ms]`,
      // ! enable this to log request details
      // {
      //   context: {
      //     method: req.method,
      //     path: req.originalUrl,
      //     status: res.statusCode,
      //     duration: `${duration}ms`,
      //     ip: req.ip,
      //     userAgent: req.headers['user-agent']
      //   }
      // }
    );
  });

  next();
});

app.use(express.json());

app.use("/api", api);
app.use("/api/files", imagesRouter);

app.listen(port, () => {
  logger.scopedInfo('server', `Server running on http://localhost:${port}`);
});