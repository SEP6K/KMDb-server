import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { connection } from "./models/data-source.js";
import { Movies, UserInfo, FavouriteMovies } from "./models/models.js";
dotenv.config();

const app = express();
app.use(express.json());
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

app.post("/userinfo", async (req, res) => {
  const userinformation: UserInfo = req.body;

  await connection.then((ds) => {
    const userinfo = ds.getRepository(UserInfo);
    userinfo.save({
      user_id: userinformation.user_id,
      first_name: userinformation.first_name,
      last_name: userinformation.last_name,
      gender: userinformation.gender,
      date_of_birth: userinformation.date_of_birth,
    });
  });
});

app.post("/favouritemovies", async (req, res) => {
  const favouritemoviesexpress: FavouriteMovies = req.body;

  await connection.then((ds) => {
    const favemovies = ds.getRepository(FavouriteMovies);
    favemovies.save({
      user_id: favouritemoviesexpress.user_id,
      movie_id: favouritemoviesexpress.movie_id,
    });
  });
  res.send();
});

app.listen(port, () => {
  console.log("listening on", 3000);
});
