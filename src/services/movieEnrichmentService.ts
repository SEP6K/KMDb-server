import * as omdbApi from "../apis/omdbApi.js";
import { connection } from "../models/data-source.js";
import { Movies } from "../models/models.js";
import * as sqlService from "./sqlService.js";

type EnrichedMovie = {
  title: string;
  releaseDate: string;
  runtime: string;
  genre: string;
  director: string;
  writers: string;
  actors: string;
  plotDescription: string;
  awards: string;
  posterUrl: string;
  boxOffice: string;
  id: number;
  year: number;
};

export async function enrichMovie(id: number): Promise<EnrichedMovie> {
  const dbMovie = await sqlService.queryMovieById(id);
  const omdbMovie = await omdbApi.getMovieById(id);

  if (dbMovie && omdbMovie) return mapMovie(dbMovie, omdbMovie);
  else return null;
}

function mapMovie(
  dbMovie: Movies,
  omdbMovie: omdbApi.OmdbMovieResponse
): EnrichedMovie {
  const mappedMovie: EnrichedMovie = {
    title: dbMovie.title,
    id: dbMovie.movie_id,
    year: dbMovie.year,
    releaseDate: omdbMovie.Released,
    runtime: omdbMovie.Runtime,
    genre: omdbMovie.Genre,
    director: omdbMovie.Director,
    writers: omdbMovie.Writer,
    actors: omdbMovie.Actors,
    plotDescription: omdbMovie.Plot,
    awards: omdbMovie.Awards,
    posterUrl: omdbMovie.Poster,
    boxOffice: omdbMovie.BoxOffice,
  };

  return mappedMovie;
}
