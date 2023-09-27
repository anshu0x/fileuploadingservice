import express from "express";
import cors from "cors";
import FileRouter from "./routes/File";
import { ensureDirectoryExists } from "./constants/path";
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
// Increase the response size limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
