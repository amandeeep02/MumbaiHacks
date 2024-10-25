import { Document, ObjectId } from "mongoose";

export interface IOrganization extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  owner: ObjectId;
  createdAt: Date;
  businessType: string;
  employees: ObjectId[];
}