import dotenv from "dotenv";
import { DataSource } from "typeorm";
import {
  Directors,
  FavouriteMovies,
  Movies,
  People,
  Ratings,
  Stars,
  UserInfo,
} from "./models.js";
dotenv.config();

const dataSource = new DataSource({
  type: "postgres",
  host: "34.159.156.47",
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
  ],
});

export const connection = dataSource.initialize();
