import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import {
  Directors,
  FavouriteMovies,
  Movies,
  People,
  Ratings,
  Stars,
  UserInfo,
  Reviews,
} from "./models.js";

dotenv.config({
  debug: true,
});

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Directors,
    Movies,
    People,
    Ratings,
    Stars,
    UserInfo,
    FavouriteMovies,
    Reviews,
  ],
});

export const connection = dataSource.initialize();
