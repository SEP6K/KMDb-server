import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { connection } from "./models/data-source.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  console.log(process.env.DB_HOST);
  connection.then((ds) => {
    // const query = createQueryBuilder("movies").getMany();
    const movieRepo = ds.getRepository("Movies");

    movieRepo.findOneBy({ movie_id: 15414 }).then((res) => {
      console.log(res);
    });
  });
});

app.listen(port, () => {
  console.log("listening on", 3000);
});
