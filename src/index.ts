import express from "express";
import "reflect-metadata";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("listening on", port);
});
