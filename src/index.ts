import * as dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { connection } from "./models/data-source.js";
import { FavouriteMovies, Movies, UserInfo } from "./models/models.js";
import * as movieEnrichmentService from "./services/movieEnrichmentService.js";
import * as sqlService from "./services/sqlService.js";
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  console.log(process.env.DB_HOST);
  res.send("Hello world");
});

app.get("/movie", async (req, res) => {
  const titleQuery = req.query.title ? req.query.title.toString() : undefined;
  console.log(titleQuery);

  const yearQuery = req.query.year
    ? parseInt(req.query.year.toString())
    : undefined;
  console.log(yearQuery);

  if (titleQuery) {
    if (yearQuery) {
      // query both by year and title
      const movies = await sqlService.queryMoviesByTitleAndYear(
        titleQuery,
        yearQuery
      );
      res.send(movies);
    } else {
      // query only by title
      const movies = await sqlService.queryMoviesByTitle(titleQuery);
      res.send(movies);
    }
  } else {
    if (yearQuery) {
      // query only by year
      const movies = await sqlService.queryMoviesByYear(yearQuery);
      res.send(movies);
    }
  }
});

app.get("/movie/enriched/:id", async (req, res) => {
  const idParam = parseInt(req.params.id.toString());
  const enrichedMovie = await movieEnrichmentService.enrichMovie(idParam);

  if (enrichedMovie) res.send(enrichedMovie);
  else res.status(404).send();
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
