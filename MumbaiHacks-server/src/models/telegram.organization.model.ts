// organization.model.ts
import mongoose, { Schema, Document } from "mongoose";

interface IOrganization extends Document {
  name: string;
  adminId: number;
  members: { chatId: number; role: string }[];
  createdAt: Date;
}

const OrganizationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  adminId: { type: Number, required: true },
  members: [
    {
      chatId: { type: Number, required: true },
      role: { type: String, enum: ["admin", "member"], required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Organization = mongoose.model<IOrganization>(
  "Organization",
  OrganizationSchema
);

export { Organization, IOrganization };
