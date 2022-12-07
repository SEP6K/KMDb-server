import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Directors, Movies, People, Ratings, Stars } from "./models.js";

dotenv.config();

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Directors, Movies, People, Ratings, Stars],
});

export const connection = dataSource.initialize();
