
import express, { Express, Request, Response } from 'express';
import "dotenv/config";

const app = express();


app.get("/", (req: Request, res: Response) => {
  res.send("WELCOME  to Node JS with Typescript & Express");
});
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Express running at port " + port);
});
