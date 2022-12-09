import express from "express";
import "reflect-metadata";
import * as movieEnrichmentService from "./services/movieEnrichmentService.js";
import * as sqlService from "./services/sqlService.js";

const app = express();
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
      sqlService.queryMoviesByTitleAndYear(titleQuery, yearQuery);
    } else {
      // query only by title
      sqlService.queryMoviesByTitle(titleQuery);
    }
  } else {
    if (yearQuery) {
      // query only by year
      sqlService.queryMovieByYear(yearQuery);
    }
  }
});

app.get("/movie/enriched/:id", async (req, res) => {
  const idParam = parseInt(req.params.id.toString());
  const enrichedMovie = await movieEnrichmentService.enrichMovie(idParam);

  if (enrichedMovie) res.send(enrichedMovie);
  else res.status(404).send();
});

app.listen(port, () => {
  console.log("listening on", 3000);
});
