import { v4 } from "uuid";
import { I_User, User } from "./user";

export interface I_project {
  id?: string;
  name: string;
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
  who: User;
}

export type I_ProjectSnapshot = Omit<I_project, "who"> & {
  who: I_User;
};

export class Project {
  readonly id: string;
  private name: string;
  private createdAt: number;
  private updatedAt?: number;
  private deletedAt?: number;
  private who: User;

  constructor(data: I_project) {
    this.id = data.id ?? v4();
    this.name = data.name;
    this.createdAt = data.createdAt ?? Math.floor(Date.now() / 1000);
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
    this.who = data.who;
  }

  getUpdatedAt() {
    return this.name;
  }
  setUpdatedAt(value: number) {
    this.updatedAt = value;
  }

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
  }

  getWho() {
    return this.who;
  }
  setWho(value: User) {
    this.who = value;
  }

  snapshot(): I_ProjectSnapshot {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      who: this.who.snapshot(),
    };
  }
}
