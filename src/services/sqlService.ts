import { dir } from "console";
import { connection } from "../models/data-source.js";
import { Directors, Movies, People, Ratings } from "../models/models.js";

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

export async function queryRatingByMovieId(id: number): Promise<Ratings> {
  return await connection.then((ds) => {
    const ratingsRepo = ds.getRepository(Ratings);

    return ratingsRepo
      .createQueryBuilder("rating")
      .where("rating.movie_id = :id", { id: id })
      .getOne()
      .then((rating) => {
        return rating;
      });
  });
}

export async function getMovieDirector(movieId: number): Promise<People> {
  return await connection.then((ds) => {
    const directorsRepo = ds.getRepository(Directors);

    return directorsRepo
      .findOne({
        where: {
          movie_id: movieId,
        },
      })
      .then((director) => {
        return queryPersonById(director.person_id);
      });
  });
}

export async function queryPersonById(personId: number): Promise<People> {
  return await connection.then((ds) => {
    const peopleRepo = ds.getRepository(People);

    return peopleRepo
      .findOne({
        where: {
          id: personId,
        },
      })
      .then((person) => {
        return person;
      });
  });
}
