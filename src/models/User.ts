// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Define the document interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Stored as a hash (bcrypt)
}

// Define the schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name."],
    },

    email: {
      type: String,
      required: [true, "Please provide an email."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // We only store the hash of the master password, NEVER the plaintext.
    password: {
      type: String,
      required: [true, "Please provide a password."],
    },
  },
  { timestamps: true }
);

// Important: Use existing model if it exists, otherwise create a new one.
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
