import * as express from "express";
import { config } from "dotenv";

config();
const app = express();

app.get("/", (req, res) => {
  res.send({ status: "up" });
});

app.get("/servers", (req, res) => {
  if (
    req.headers.Authentication !==
    `MHSF-Backend-Server ${process.env.MHSF_SECRET}`
  )
    res.status(401).send({ error: "Unauthorized" });
  else
    fetch("https://api.minehut.com/servers").then((c) => {
      c.json().then((v) => {
        res.send(v);
      });
    });
});

app.listen(6080, () => {
  console.log("Backend API listening on port 6080");
});
