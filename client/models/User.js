import mongoose from "mongoose";
import { model, Schema } from "mongoose";

const UserSchema = new Schema(
    {
        profileUrl: {
          type: String,
        },
        name: {
          type: String,
        },
        description:{
                type: String,
        },
        email: {
          type: String,
          required: true,
          unique: true,
          match: [/.+@.+\..+/, "Please enter a valid email address"],
        },
      password: {
      type: String,
      required: true, // required for authentication
      minlength: 6,
      select: false, // prevents password from showing in queries
    },
      },
      {
        timestamps: true, // Adds createdAt and updatedAt fields
        collection: "users", // Explicitly specify the collection name
      }
    );
export default mongoose.models.User || model("User", UserSchema)