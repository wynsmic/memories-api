import { Call, I_CallSnapshot } from "../../domain/entities/call";
import { User } from "../../domain/entities/user";
import { MongoDBClient } from "../persistance/mongodb/client";
import { CollectionEnum } from "../persistance/mongodb/colection-enum";

export class CallDAO {
  private mongoCollection =
    MongoDBClient.getInstance().getCollection<I_CallSnapshot>(
      CollectionEnum.CALLS
    );

  insertOne = async (call: Call) => {
    this.mongoCollection.insertOne(call.snapshot());
  };

  findOne = async (query: Partial<I_CallSnapshot>) => {
    const data = await this.mongoCollection.findOne(query);
    if (!data) {
      throw new Error("Document not found");
    }
    return new Call({
      ...data,
      to: new User(data.to),
      from: new User(data.from),
    });
  };

  updateOneCall = async (call: Call) => {
    call.setUpdatedAt(Math.floor(Date.now() / 1000));
    await this.mongoCollection.findOneAndReplace(
      { id: call.id },
      call.snapshot()
    );
  };

  findMany = async (
    query: Partial<I_CallSnapshot>,
    fieds: Projection = {}
  ): Promise<Call[]> => {
    const list = await this.mongoCollection
      .find(query, { projection: fieds })
      .sort({createdAt: -1})
      .toArray();
    if (!list) {
      throw new Error("Documents not found");
    }
    return list.map(this.toCallObject);
  };
  private toCallObject = (c: I_CallSnapshot): Call =>
    new Call({ ...c, from: new User(c.from), to: new User(c.to) });
}

type Projection = Partial<{ [key in keyof I_CallSnapshot]: boolean }>;
