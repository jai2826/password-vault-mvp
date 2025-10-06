// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Define the document interface
export interface IItem extends Document {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

// Define the schema
const ItemSchema: Schema<IItem> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a name."],
    },

    username: {
      type: String,
      required: [true, "Please provide a username."],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password."],
    },

    url: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Important: Use existing model if it exists, otherwise create a new one.
const Item: Model<IItem> =
  (mongoose.models.Item as Model<IItem>) ||
  mongoose.model<IItem>("Item", ItemSchema);

export default Item;
