import { dir } from "console";
import { connection } from "../models/data-source.js";
import {
  ActorWithMovies,
  Directors,
  FavouriteMovies,
  Movies,
  People,
  Ratings,
  Reviews,
  Stars,
  UserInfo,
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
        if (director) return queryPersonById(director.person_id);
        else return null;
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
        let actors: People[] = await Promise.all(
          stars.map(async (star) => {
            return await queryPersonById(star.person_id);
          })
        );

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
        if (person) return person;
        else return null;
      });
  });
}

export async function queryAverageMovieRatings(
  fromYear: number,
  toYear: number
) {
  return await connection.then(async (ds) => {
    return await ds
      .query(
        `SELECT AVG(rating) as avgRating, CAST(year AS int) AS year 
         FROM movies inner join ratings r 
         ON movies.movie_id = r.movie_id
         WHERE year BETWEEN ${fromYear} and ${toYear}
         GROUP BY year;`
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

export async function queryTopStars(count: number) {
  return await connection.then(async (ds) => {
    return await ds
      .query(
        `SELECT COUNT(movie_id) AS moviesStarred, name, person_id
          FROM stars
          INNER JOIN people p
          ON p.id = stars.person_id
          GROUP BY p.name, person_id
          ORDER BY moviesStarred DESC
          LIMIT ${count};`
      )
      .then((res: ActorWithMovies[]) => {
        console.log({ res });
        return res;
      });
  });
}

export async function saveUserInfo(userinformation: UserInfo) {
  return await connection.then((ds) => {
    const userinfo = ds.getRepository(UserInfo);
    userinfo.save({
      user_id: userinformation.user_id,
      user_name: userinformation.user_name,
      gender: userinformation.gender,
      date_of_birth: userinformation.date_of_birth,
    });
  });
}

export async function saveFavouriteMovies(favemoviesexpress: FavouriteMovies) {
  return await connection.then((ds) => {
    const favemovies = ds.getRepository(FavouriteMovies);
    favemovies.save({
      user_id: favemoviesexpress.user_id,
      movie_id: favemoviesexpress.movie_id,
    });
  });
}

export async function deleteFavouriteMovies(
  favemoviesexpress: FavouriteMovies
) {
  return await connection.then((ds) => {
    const favemovies = ds.getRepository(FavouriteMovies);
    favemovies.delete({
      user_id: favemoviesexpress.user_id,
      movie_id: favemoviesexpress.movie_id,
    });
  });
}

export async function saveReviews(userReviews: Reviews) {
  return await connection.then((ds) => {
    const usrReviews = ds.getRepository(Reviews);
    usrReviews.save({
      movie_id: userReviews.movie_id,
      user_id: userReviews.user_id,
      user_comments: userReviews.user_comments,
      user_ratings: userReviews.user_ratings,
    });
  });
}

export async function searchForUserName(user_name: string): Promise<UserInfo> {
  return await connection.then((ds) => {
    const userForSearch = ds.getRepository(UserInfo);
    return userForSearch
      .findOne({ where: { user_name: user_name } })
      .then((user) => {
        if (user) return user;
        else return null;
      });
  });
}

export async function getUserById(uId: string): Promise<UserInfo> {
  return await connection.then((ds) => {
    const userRepo = ds.getRepository(UserInfo);
    return userRepo.findOne({ where: { user_id: uId } }).then((user) => {
      if (user) return user;
      else return null;
    });
  });
}

export async function getFavouritesListForUser(
  userId: string
): Promise<FavouriteMovies[]> {
  return await connection.then((ds) => {
    const favouritemoviesRepo = ds.getRepository(FavouriteMovies);

    return favouritemoviesRepo
      .createQueryBuilder("fav")
      .where("fav.user_id = :id", { id: userId })
      .getMany()
      .then((favourites) => {
        return favourites;
      });
  });
}

export async function queryReviewsByMovieId(id: number): Promise<Reviews[]> {
  return await connection.then(async (ds) => {
    return await ds
      .query(`SELECT * FROM reviews r WHERE r.movie_id = ${id}`)
      .then((res: Reviews[]) => res);
  });
}
