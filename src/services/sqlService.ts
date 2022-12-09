import { connection } from "../models/data-source.js";
import { Movies } from "../models/models.js";

export async function queryMoviesByTitle(title: string): Promise<Movies[]> {
  console.log("query movie by title" + title);
  return await connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    return movieRepo
      .createQueryBuilder("movie")
      .where("movie.title LIKE :title", { title: `%${title}%` })
      .take(5)
      .getMany()
      .then((movies) => {
        console.log(movies);
        return movies;
      });
  });
}

export async function queryMoviesByYear(year: number): Promise<Movies[]> {
  return await connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    return movieRepo
      .createQueryBuilder("movie")
      .where("movie.year = :year", { year: year })
      .take(5)
      .getMany()
      .then((movies) => {
        return movies;
      });
  });
}

export async function queryMoviesByTitleAndYear(
  title: string,
  year: number
): Promise<Movies[]> {
  return await connection.then((ds) => {
    const movieRepo = ds.getRepository(Movies);

    return movieRepo
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
