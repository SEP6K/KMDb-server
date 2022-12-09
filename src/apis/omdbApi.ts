import * as dotenv from "dotenv";
dotenv.config({
  debug: true,
});

// import fetch from "node-fetch";
const API_URL = "http://www.omdbapi.com/";
const API_KEY = process.env.OMDB_API_KEY;

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

type Rating = {
  source: string;
  value: string;
};

export type OmdbMovieResponse = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  ImdbRating: string;
  ImdbVotes: string;
  ImdbId: string;
  Type: string;
  Dvd: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
};

export async function getMovieById(id: number) {
  return await fetch(API_URL + `?apikey=${API_KEY}&i=${appendId(id)}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "get",
  })
    .then((response: any) => response.json())
    .then((response: OmdbMovieResponse) => {
      return response;
    });
}

function appendId(id: number): string {
  return `tt${id}`;
}
