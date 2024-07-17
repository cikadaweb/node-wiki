import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import hbs from "hbs";
import multer from "multer";
import fs from "fs";
import { getFiles } from "./folder";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const filesDir = path.join(__dirname, "..", "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageConfig });

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use("/files", express.static(filesDir));

app.get("/", (req: Request, res: Response) => {
  const files = getFiles("./files");
  res.render("index", {
    title: "File storage",
    description: "List of stored files",
    files,
  });
});

app.get("/upload", (req: Request, res: Response) => {
  res.render("upload", {
    title: "Upload files",
  });
});

app.post(
  "/upload",
  upload.single("filedata"),
  (req: Request, res: Response, next: NextFunction) => {
    const filedata = req.file;
    if (!filedata) {
      res.send("Error file upload");
    } else {
      res.render("upload", {
        title: "Upload files",
      });
    }
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
