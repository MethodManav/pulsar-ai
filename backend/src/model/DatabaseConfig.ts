import mongoose, { Connection } from "mongoose";
import { config } from "../utiles/Config";

const uri = config.DB_URL;
const dbName = config.DB_APP;

export class DatabaseConfig {
  private connection?: Connection;

  async connect(): Promise<Connection> {
    try {
      await mongoose.connect(uri, { dbName });
      this.connection = mongoose.connection;
      console.log("Connected to MongoDB with Mongoose");

      if (this.connection && this.connection.db) {
        const collections = await this.connection.db
          .listCollections()
          .toArray();
        const collectionNames = collections.map((col) => col.name);
        console.log(
          `Database: ${dbName} is connected with collections: ${collectionNames.join(
            ", "
          )}`
        );
      } else {
        console.log(
          `Database: ${dbName} is connected, but unable to list collections.`
        );
      }
      return this.connection;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  }

  getDb(): Connection | undefined {
    return this.connection;
  }
}
