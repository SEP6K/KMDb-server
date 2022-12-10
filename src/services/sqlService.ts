import { dir } from "console";
import { connection } from "../models/data-source.js";
import {
  Directors,
  Movies,
  People,
  Ratings,
  Stars,
  YearlyActors,
  YearRating,
} from "../models/models.js";

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

export async function getMovieStars(movieId: number): Promise<People[]> {
  return await connection.then((ds) => {
    const starsRepo = ds.getRepository(Stars);

    return starsRepo
      .find({
        where: {
          movie_id: movieId,
        },
      })
      .then(async (stars) => {
        console.log({ stars });
        let actors: People[] = [];

        stars.forEach(async (star) => {
          await queryPersonById(star.person_id).then((person) => {
            actors.push(person);
          });
        });
        console.log({ actors });
        return actors;
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

export async function queryAverageMovieRatings() {
  return await connection.then(async (ds) => {
    return await ds
      .query(
        "SELECT AVG(rating) as avgRating, CAST(year AS int) AS year FROM movies inner join ratings r on movies.movie_id = r.movie_id GROUP BY year"
      )
      .then((res: YearRating[]) => {
        return res;
      });
  });
}

export async function queryActorsBornYearly(fromYear: number, toYear: number) {
  return await connection.then(async (ds) => {
    return await ds
      .query(
        `SELECT COUNT(person_id), birth 
           FROM stars 
           INNER JOIN people p 
           ON p.id = stars.person_id 
           WHERE birth IS NOT NULL AND birth BETWEEN ${fromYear} AND ${toYear}
           GROUP BY birth;`
      )
      .then((res: YearlyActors[]) => {
        console.log({ res });
        return res;
      });
  });
}
