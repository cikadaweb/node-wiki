import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import hbs from "hbs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + '/views/partials');

app.get("/", (req: Request, res: Response) => {
    res.render("index", {
        title: "File storage",
        description: "List of stored files"
    });
});

app.get("/upload", (req: Request, res: Response) => {
    res.render("upload", {
        title: "Upload files",
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});