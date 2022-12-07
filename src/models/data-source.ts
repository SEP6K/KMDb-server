import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Directors, Movies, People, Ratings, Stars } from "./models.js";
dotenv.config();

const dataSource = new DataSource({
  type: "postgres",
  host: "34.159.156.47",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  entities: [Directors, Movies, People, Ratings, Stars],
});

export const connection = dataSource.initialize();
