import * as mongoDB from "mongodb";
import { Logger } from "../../logger";
import { CollectionEnum } from "./colection-enum";

export class MongoDBClient {
  static instance: MongoDBClient;
  private client: mongoDB.MongoClient;
  private db: mongoDB.Db | null = null;
  private logger = new Logger();

  private constructor() {
    const dbConnectionString = process.env.MONGO_CONNECTION_STRING ?? "";
    const params = {}
    this.client = new mongoDB.MongoClient(dbConnectionString, params);
  }

  public static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  public getCollection<Model extends mongoDB.Document>(
    collectionName: CollectionEnum
  ): mongoDB.Collection<Model> {
    if (!this.db) {
      this.connect(); // Reconnect for the next request
      throw new Error("Mongo was not connected");
    }
    return this.db.collection<Model>(collectionName);
  }

  async connect(): Promise<void> {
    try {
      const databaseName = process.env.MONGO_DATABASE_NAME;

      await this.client.connect();
      this.db = this.client.db(databaseName);
      this.logger.info({
        component: "MongoDBClient",
        message: `Successfully connected to database: ${databaseName}`,
      });
    } catch (error) {
      this.logger.error({
        component: "MongoDBClient",
        message: `Failed to connect to mongo database: ${error}`,
      });
    }
  }

  async disconnect(): Promise<void> {
    await this.client?.close();
    this.db = null;
    this.logger.info({
      component: "MongoDBClient",
      message: "Mongo disconnected successfully.",
    });
  }
}
