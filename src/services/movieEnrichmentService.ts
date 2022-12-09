import * as omdbApi from "../apis/omdbApi.js";
import { connection } from "../models/data-source.js";
import { Movies, People, Ratings } from "../models/models.js";
import * as sqlService from "./sqlService.js";

type EnrichedMovie = {
  title: string;
  releaseDate: string;
  runtime: string;
  genre: string;
  director: Director;
  writers: string;
  actors: string;
  plotDescription: string;
  awards: string;
  posterUrl: string;
  boxOffice: string;
  id: number;
  year: number;
  rating: number;
};

type Director = {
  id: number;
  name: string;
  birth: number;
};

export async function enrichMovie(movieId: number): Promise<EnrichedMovie> {
  const dbMovie = await sqlService.queryMovieById(movieId);
  const dbRating = await sqlService.queryRatingByMovieId(movieId);
  const dbDirector = await sqlService.getMovieDirector(movieId);
  const omdbMovie = await omdbApi.getMovieById(movieId);

  if (dbMovie && omdbMovie)
    return mapMovie(dbMovie, dbRating, dbDirector, omdbMovie);
  else return null;
}

function mapMovie(
  dbMovie: Movies,
  dbRating: Ratings,
  dbDirector: People,
  omdbMovie: omdbApi.OmdbMovieResponse
): EnrichedMovie {
  const mappedMovie: EnrichedMovie = {
    title: dbMovie.title,
    id: dbMovie.movie_id,
    year: dbMovie.year,
    releaseDate: omdbMovie.Released,
    runtime: omdbMovie.Runtime,
    genre: omdbMovie.Genre,
    director: {
      id: dbDirector.id,
      name: dbDirector.name,
      birth: dbDirector.birth,
    } as Director,
    writers: omdbMovie.Writer,
    actors: omdbMovie.Actors,
    plotDescription: omdbMovie.Plot,
    awards: omdbMovie.Awards,
    posterUrl: omdbMovie.Poster,
    boxOffice: omdbMovie.BoxOffice,
    rating: dbRating.rating,
  };

  return mappedMovie;
}
