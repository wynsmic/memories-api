import {
  I_ProjectSnapshot,
  I_project,
  Project,
} from "../../domain/entities/project";
import { User } from "../../domain/entities/user";
import { MongoDBClient } from "../persistance/mongodb/client";
import { CollectionEnum } from "../persistance/mongodb/colection-enum";

export class ProjectDAO {
  private mongoCollection =
    MongoDBClient.getInstance().getCollection<I_ProjectSnapshot>(
      CollectionEnum.PROJECTS
    );

  insertOne = async (project: Project) => {
    return this.mongoCollection.insertOne(project.snapshot());
  };

  findOne = async (query: Partial<I_project>) => {
    const data = await this.mongoCollection.findOne(query);
    if (!data) {
      throw new Error("Document not found");
    }
    return new Project({
      ...data,
      who: new User(data.who),
    });
  };

  findMany = async (
    query: Partial<I_ProjectSnapshot>,
    filters: Projection = {}
  ): Promise<Project[]> => {
    const list = await this.mongoCollection
      .find(query, { projection: filters })
      .toArray();
    if (!list) {
      throw new Error("Documents not found");
    }
    return list.map(
      (item) =>
        new Project({
          ...item,
          who: new User(item.who),
        })
    );
  };

  updateOne = async (project: Project) => {
    project.setUpdatedAt(Math.floor(Date.now() / 1000));
    await this.mongoCollection.findOneAndReplace(
      { id: project.id },
      project.snapshot()
    );
  };
}

type Projection = Partial<{ [key in keyof I_ProjectSnapshot]: boolean }>;
