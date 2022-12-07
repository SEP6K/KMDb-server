import express from "express";
import "reflect-metadata";
import { createQueryBuilder } from "typeorm";
import { dataSource } from "./models/data-source.js";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  dataSource.initialize().then((ds) => {
    // const query = createQueryBuilder("movies").getMany();
    const result = ds.getRepository("Movies").findOneBy({ id: 1 });
    console.log(result);
  });
});

app.listen(port, () => {
  console.log("listening on", 3000);
});
