// MumbaiHacks-server/src/Interfaces/user.interface.ts
import { ObjectId, Document } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  emailId: string;
  role: string;
  createdAt: string;
  hashed_password: string;
  salt: string;
  organizationIds?: ObjectId[]; // Updated to array of ObjectId
}