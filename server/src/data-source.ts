import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Event } from "./entities/Event";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "google_events_db",
  synchronize: true,
  logging: false,
  entities: [User, Event],
  migrations: [],
  subscribers: [],
});
