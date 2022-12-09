import { connection } from "../models/data-source.js";
import { Movies } from "../models/models.js";

export function queryMoviesByTitle(title: string) {
  return connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    return movieRepo
      .createQueryBuilder("movie")
      .where("movie.title LIKE :title", { title: `%${title}%` })
      .take(5)
      .getMany()
      .then((movies) => {
        return movies;
      });
  });
}

export function queryMovieByYear(year: number) {
  return connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    movieRepo
      .createQueryBuilder("movie")
      .where("movie.year = :year", { year: year })
      .take(5)
      .getMany()
      .then((movies) => {
        return movies;
      });
  });
}

export function queryMoviesByTitleAndYear(title: string, year: number) {
  return connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    movieRepo
      .createQueryBuilder("movie")
      .where("movie.title LIKE :title AND movie.year = :year", {
        title: `%${title}%`,
        year: year,
      })
      .take(5)
      .getMany()
      .then((movies) => {
        return movies;
      });
  });
}

export async function queryMovieById(id: number): Promise<Movies> {
  return await connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    return movieRepo
      .createQueryBuilder("movie")
      .where("movie.movie_id = :id", { id: id })
      .getOne()
      .then((movieQueriedById) => {
        return movieQueriedById;
      });
  });
}
