import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { Event } from "./entities/Event";

export const userRepo = () => AppDataSource.getRepository(User);
export const eventRepo = () => AppDataSource.getRepository(Event);
