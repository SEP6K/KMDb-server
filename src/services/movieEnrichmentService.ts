import * as omdbApi from "../apis/omdbApi.js";
import { Movies, People, Ratings } from "../models/models.js";
import * as sqlService from "./sqlService.js";
import * as tmdbApi from "../apis/tmdbApi.js";

type EnrichedMovie = {
  title: string;
  releaseDate: string;
  runtime: string;
  genre: string;
  director: Person;
  writers: string;
  actors: Person[];
  plotDescription: string;
  awards: string;
  posterUrl: string;
  boxOffice: string;
  id: number;
  year: number;
  backdropPath: string;
  posterPath: string;
};

type Person = {
  id: number;
  name: string;
  birth: number;
};

export async function enrichMovie(movieId: number): Promise<EnrichedMovie> {
  const dbMovie = await sqlService.queryMovieById(movieId);
  const dbRating = await sqlService.queryRatingByMovieId(movieId);
  const dbDirector = await sqlService.getMovieDirector(movieId);

  const dbStars = await sqlService.getMovieStars(movieId);
  const tmdbMovie = await tmdbApi.getMovieById(movieId);

  const omdbMovie = await omdbApi.getMovieById(movieId);

  if (dbMovie && omdbMovie)
    return mapMovie(
      dbMovie,
      dbRating,
      dbDirector,
      dbStars,
      omdbMovie,
      tmdbMovie
    );
  else return null;
}

function mapMovie(
  dbMovie: Movies,
  dbRating: Ratings,
  dbDirector: People,
  dbActors: People[],
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
    director: {
      id: dbDirector.id,
      name: dbDirector.name,
      birth: dbDirector.birth,
    } as Person,
    writers: omdbMovie.Writer,
    actors: mapActors(dbActors),
    plotDescription: omdbMovie.Plot,
    awards: omdbMovie.Awards,
    posterUrl: omdbMovie.Poster,
    boxOffice: omdbMovie.BoxOffice,
    backdropPath: tmdbMovie.backdrop_path,
    posterPath: tmdbMovie.poster_path,
  };

  return mappedMovie;
}

function mapActors(dbActors: People[]): Person[] {
  let mappedActors: Person[] = [];

  dbActors.forEach((actor) => {
    mappedActors.push({
      id: actor.id,
      name: actor.name,
      birth: actor.birth,
    } as Person);
  });
  return mappedActors;
}
