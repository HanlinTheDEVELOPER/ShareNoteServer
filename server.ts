import express, { Request, Response } from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScrssssadfdfipt Express!");
  console.log("Hello, TypeScript Express!");
});

app.listen(port, () => {
  console.log(process.env.App);
  console.log(`Server running at http://localhost:${port}`);
});
