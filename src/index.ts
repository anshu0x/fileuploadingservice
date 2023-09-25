import express from "express";
import cors from "cors";
import FileRouter from "./routes/File";
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(FileRouter);

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
