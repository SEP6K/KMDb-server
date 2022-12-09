import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { connection } from "./models/data-source.js";
import { Movies, UserInfo, FavouriteMovies } from "./models/models.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
      .then((res) => {
        console.log(res);
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
      .then((res) => {
        console.log(res);
      });
  });
});

app.get("/userinfo", async (req, res) => {
  await connection.then((ds) => {
    const userinfo = ds.getRepository(UserInfo);
    userinfo.save({
      user_id: 1,
      first_name: "john",
      last_name: "doe",
      gender: "M",
      date_of_birth: "14 dec 2020",
    });
  });
});

app.get("/favouritemovies", async (req, res) => {
  await connection.then((ds) => {
    const favemovies = ds.getRepository(FavouriteMovies);
    favemovies.save({
      user_id: 1,
      movie_id: 65808,
    });
  });
});

app.listen(port, () => {
  console.log("listening on", 3000);
});
