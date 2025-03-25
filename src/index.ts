
import express, { Request, Response } from 'express';
import "dotenv/config";

const app = express();
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("WELCOME  to Node JS with Typescript & Express");
});

app.post("/login", (req, res) => {
  try {

    setTimeout(() => {
      res.send({

        "user": req.body.user,
        "odoo_id": 310696,
        "name": "FULANITO PEREZ",
        "branch": [
          50,
          "LA PIMIENTA"
        ],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImxvZ2luIjoiUmV5bmFNZXJjZWRlcyIsImVtYWlsIjoicm15YW0iLCJsb2FuX29mZmljZXIiOjMxMDY5NiwibmFtZSI6IlJFWU5BIE1FUkNFREVTIiwibGFzdG5hbWUiOiJZQU0iLCJzZWNvbmRfbGFzdG5hbWUiOiJCQUxBTiIsImJyYW5jaCI6WzUwLCJDQU1QRUNIRSJdLCJvZmZpY2VyX3JhbmsiOltudWxsLCIiXX0sInN5bmNfaW5mbyI6eyJsb2NhbF90YXJnZXQiOiJsb2NhbC1kYiIsInJlbW90ZV90YXJnZXQiOiJjbnNydi1wcm9tb3RvciIsInN5bmNfZXhwaXJhdGlvbiI6IjIwMjUtMDMtMjZUMTg6MjU6MzguMzI5WiJ9LCJpYXQiOjE3NDI5MjcxMzh9.AQCSq1jauK_yVVLODT-bMK3zGDe7zBHzLEr6AwiamSk"

      })
    }, 2000)
  }
  catch (e: any) {
    res.send(e.message);
  }
})
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Express running at port " + port);
});
