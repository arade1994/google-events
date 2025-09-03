import app from "./src/app";
import { AppDataSource } from "./src/data-source";

import "reflect-metadata";

async function start() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connected");
    }

    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

start();
