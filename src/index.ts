import express from "express";
import cors from "cors";
import FileRouter from "./routes/File";
import compression from "compression";
import { ensureDirectoryExists } from "./constants/path";
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
  app.use(express.json());
  app.use(compression({
    level:9
  }));
  app.use(
    cors({
      origin: "*",
    })
  );
  await ensureDirectoryExists();

  app.use(FileRouter);

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
