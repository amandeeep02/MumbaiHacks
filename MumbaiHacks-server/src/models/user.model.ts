import { IUser } from "../Interfaces/user.interface";
import mongoose from "mongoose";
import crypto from "crypto";
import { Schema } from "mongoose";
// Import Organization model to register it in Mongoose before populating
import {OrganizationModel }from './organization.model';

const UserSchema = new mongoose.Schema<IUser>(
  {
        _id: {
                type: Schema.Types.ObjectId,
                auto: true, // Automatically generate ObjectId
              },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    hashed_password: {
      type: String,
    },
    salt: {
      type: String,
    },
    organizationIds: {
        type: [Schema.Types.ObjectId],
        ref: 'Organization',
        required: false,
      },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("password")
  .set(function (this: any, password: string) {
    this._password = password;
    this.salt = this.makesalt();
    this.hashed_password = this.encrptPassword(password);
  })
  .get(function (this: any) {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainText: string) {
    return this.encrptPassword(plainText) === this.hashed_password;
  },

  encrptPassword: function (password: string) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makesalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

UserSchema.set("toJSON", { virtuals: true });

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
