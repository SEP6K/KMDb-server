import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import * as tmdbApi from "./apis/tmdbApi.js";
import * as movieEnrichmentService from "./services/movieEnrichmentService.js";
import * as sqlService from "./services/sqlService.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  console.log(process.env.DB_HOST);
  res.send("Hello world");
});

app.get("/movie/title/:title", async (req, res) => {
  const titleQuery = req.params.title ? req.params.title.toString() : undefined;
  console.log(titleQuery);

  const movies = await sqlService.queryMoviesByTitle(titleQuery);
  res.send(movies);
});

app.get("/movie/year/:year", async (req, res) => {
  const yearQuery = req.params.year
    ? parseInt(req.params.year.toString())
    : undefined;
  console.log(yearQuery);

  const movies = await sqlService.queryMoviesByYear(yearQuery);
  res.send(movies);
});

app.get("/movie/id/:id", async (req, res) => {
  const idQuery = req.params.id
    ? parseInt(req.params.id.toString())
    : undefined;
  console.log(idQuery);

  const movie = await sqlService.queryMovieById(idQuery);
  res.send(movie);
});

app.get("/movie/similar/:userId", async (req, res) => {
  const userIdParam = req.params.userId
    ? req.params.userId.toString()
    : undefined;
  console.log(userIdParam);

  const favouriteMoviesList = await sqlService.getFavouritesListForUser(
    userIdParam
  );

  console.log({ favouriteMoviesList });

  let similarMovies: tmdbApi.TmdbMovieResponse[] = await Promise.all(
    favouriteMoviesList.map(async (element) => {
      return await tmdbApi.getSimilarMovies(element.movie_id);
    })
  );
  res.send(similarMovies);
});

app.get("/chart/ratings", async (req, res) => {
  const fromYearQuery = req.query.from
    ? parseInt(req.query.from.toString())
    : 1970;
  const toYearQuery = req.query.to ? parseInt(req.query.to.toString()) : 2030;
  const yearlyRatings = await sqlService.queryAverageMovieRatings(
    fromYearQuery,
    toYearQuery
  );
  res.send(yearlyRatings);
});

app.get("/chart/actors", async (req, res) => {
  const fromYearQuery = req.query.from
    ? parseInt(req.query.from.toString())
    : 1850;
  const toYearQuery = req.query.to ? parseInt(req.query.to.toString()) : 2030;
  const yearlyActors = await sqlService.queryActorsBornYearly(
    fromYearQuery,
    toYearQuery
  );
  res.send(yearlyActors);
});

app.get("/chart/topStars/:count", async (req, res) => {
  const countQuery = parseInt(req.params.count.toString());
  const topStars = await sqlService.queryTopStars(countQuery);
  res.send(topStars);
});

app.get("/movie/enriched/:id", async (req, res) => {
  const idParam = parseInt(req.params.id.toString());
  const enrichedMovie = await movieEnrichmentService.enrichMovie(idParam);

  if (enrichedMovie) res.send(enrichedMovie);
  else res.status(404).send();
});

app.post("/userinfo", async (req, res) => {
  const userinformation = req.body;

  sqlService.saveUserInfo(userinformation);
  res.send();
});

app.post("/favouritemovies", async (req, res) => {
  const favemovies = req.body;

  sqlService.saveFavouriteMovies(favemovies);

  res.send();
});

app.delete("/favouritemovies", async (req, res) => {
  const favemovies = req.body;

  sqlService.deleteFavouriteMovies(favemovies);

  res.send();
});

app.post("/reviews", async (req, res) => {
  const userReviews = req.body;

  sqlService.saveReviews(userReviews);

  res.send();
});

app.get("/reviews/:movieId", async (req, res) => {
  const movieIdQuery = req.params.movieId
    ? parseInt(req.params.movieId.toString())
    : 0;
  const reviews = await sqlService.queryReviewsByMovieId(movieIdQuery);

  res.send(reviews);
});

app.get("/userinfo/favouritemovies/:user_name", async (req, res) => {
  const userNameQuery = req.params.user_name
    ? req.params.user_name.toString()
    : "";
  const user = await sqlService.searchForUserName(userNameQuery);
  console.log(user);
  if (user == null) {
    res.status(404).send();
    return;
  } else {
    const favouriteMoviesList = await sqlService.getFavouritesListForUser(
      user.user_id
    );

    res.send(favouriteMoviesList);
  }
});
app.get("/userinfo/:userId", async (req, res) => {
  const userIdQuery = req.params.userId ? req.params.userId.toString() : "";

  const user = await sqlService.getUserById(userIdQuery);
  console.log(user);

  if (user == null) {
    res.status(404).send();
    return;
  } else {
    res.send(user);
  }
});

app.all("*", function (req, res) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
});

app.listen(port, () => {
  console.log("listening on", 3000);
});
