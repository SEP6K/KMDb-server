import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { connection } from "./models/data-source.js";
import { Movies } from "./models/models.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  console.log(process.env.DB_HOST);
  res.send("Hello world");
});

app.get("/movie/year", async (req, res) => {
  console.log(process.env.DB_HOST);
  connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    movieRepo.findOneBy({ movie_id: 15414 }).then((res) => {
      console.log(res);
    });
    movieRepo
      .createQueryBuilder("movie")
      .where("movie.year = :year", { year: 1999 })
      .getMany()
      .then((movies) => {
        console.log(movies);
        res.send(movies);
      });
  });
});

app.get("/movie/title", async (req, res) => {
  const title = req.query.title;
  connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    movieRepo
      .createQueryBuilder("movie")
      .where("movie.title LIKE :title", { title: `%${title}%` })
      .take(5)
      .getMany()
      .then((movies) => {
        console.log(movies);
        res.send(movies);
      });
  });
});

app.listen(port, () => {
  console.log("listening on", port);
});
