import express from "express";
import "reflect-metadata";
import { connection } from "./models/data-source.js";
import { Movies } from "./models/models.js";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  console.log(process.env.DB_HOST);
  res.send("Hello world");
});

app.get("/movie", async (req, res) => {
  const titleQuery = req.query.title;
  console.log(titleQuery);
  const yearQuery = req.query.year;
  console.log(yearQuery);

  connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    if (titleQuery) {
      if (yearQuery) {
        // query both by year and title
        movieRepo
          .createQueryBuilder("movie")
          .where("movie.title LIKE :title AND movie.year = :year", {
            title: `%${titleQuery}%`,
            year: yearQuery,
          })
          .take(5)
          .getMany()
          .then((movies) => {
            console.log(movies);
            res.send(movies);
          });
      } else {
        // query only by title
        movieRepo
          .createQueryBuilder("movie")
          .where("movie.title LIKE :title", { title: `%${titleQuery}%` })
          .take(5)
          .getMany()
          .then((movies) => {
            console.log(movies);
            res.send(movies);
          });
      }
    } else {
      if (yearQuery) {
        // query only by year
        movieRepo
          .createQueryBuilder("movie")
          .where("movie.year = :year", { year: yearQuery })
          .getMany()
          .then((movies) => {
            console.log(movies);
            res.send(movies);
          });
      }
    }
  });
});

app.listen(port, () => {
  console.log("listening on", 3000);
});
