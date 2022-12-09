import { connection } from "../models/data-source.js";
import { FavouriteMovies, Movies, UserInfo } from "../models/models.js";

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

export async function queryMoviesByFavourites(
  movie_id: number,
  user_id: number
): Promise<FavouriteMovies> {
  return await connection.then((ds) => {
    const movieRepo = ds.getRepository(FavouriteMovies);

    return movieRepo
      .createQueryBuilder("favouritemovies")
      .where(
        "favouritemovies.movie_id = :movie_id AND favouritemovies.user_id = :user_id",
        { user_id: user_id, movie_id: movie_id }
      )
      .getOne()
      .then((movieQueried) => {
        return movieQueried;
      });
  });
}

export async function queryMoviesForUserInfo(
  user_id: number
): Promise<UserInfo> {
  return await connection.then((ds) => {
    const movieRepo = ds.getRepository(UserInfo);

    return movieRepo
      .createQueryBuilder("userinfo")
      .where("userinfo.user_id = :user_id", { user_id: user_id })
      .getOne()
      .then((movieQueried) => {
        return movieQueried;
      });
  });
}
