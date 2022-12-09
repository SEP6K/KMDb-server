import * as dotenv from "dotenv";
dotenv.config({
  debug: true,
});

const API_KEY = process.env.TMDB_KEY;
const API_URL = "https://developers.themoviedb.org/";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

type Collection = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
};

type Genre = {
  id: number;
  name: string;
};

type ProductionCompanies = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

type PorductionCountries = {
  iso_3166_1: string;
  name: string;
};

type Languages = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type TmdbMovieResponse = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: Collection;
  budget: number;
  genres: Genre;
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompanies;
  production_countries: PorductionCountries;
  release_date: string;
  revenue: number;
  runtime: 121;
  spoken_languages: Languages;
  status: string;
  tagline: string;
  title: string;
  video: string;
  vote_average: number;
  vote_count: number;
};
