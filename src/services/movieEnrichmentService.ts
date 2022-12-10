import * as omdbApi from "../apis/omdbApi.js";
import { connection } from "../models/data-source.js";
import { Movies } from "../models/models.js";
import * as sqlService from "./sqlService.js";
import * as tmdbApi from "../apis/tmdbApi.js";

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
  backdropPath: string;
  posterPath: string;
};

export async function enrichMovie(id: number): Promise<EnrichedMovie> {
  const dbMovie = await sqlService.queryMovieById(id);
  const omdbMovie = await omdbApi.getMovieById(id);
  const tmdbMovie = await tmdbApi.getMovieById(id);

  if (dbMovie && omdbMovie && tmdbMovie)
    return mapMovie(dbMovie, omdbMovie, tmdbMovie);
  else return null;
}

function mapMovie(
  dbMovie: Movies,
  omdbMovie: omdbApi.OmdbMovieResponse,
  tmdbMovie: tmdbApi.TmdbMovieResponse
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
    backdropPath: tmdbMovie.backdrop_path,
    posterPath: tmdbMovie.poster_path,
  };

  return mappedMovie;
}
