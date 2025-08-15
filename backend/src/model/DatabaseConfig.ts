import { MongoClient, Db } from "mongodb";

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private client: MongoClient;
  private db?: Db;

  private constructor(private uri: string, private dbName: string) {
    this.client = new MongoClient(this.uri);
  }

  public static getInstance(uri: string, dbName: string): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig(uri, dbName);
    }
    return DatabaseConfig.instance;
  }

  public async connect(): Promise<Db> {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
    this.db = undefined;
  }
}
