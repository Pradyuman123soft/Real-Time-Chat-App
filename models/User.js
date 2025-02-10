import mongoose from "mongoose";
import { model, Schema } from "mongoose";

const UserSchema = new Schema(
    {
        profileUrl: {
          type: String,
        },
        name: {
          type: String,
          required: true,
        },
        // age: {
        //   type: Number,
        //   required: true,
        //   min: [1, "Age must be at least 1"],
        //   max: [120, "Age must not exceed 120"],
        // },
        description:{
                type: String,
                required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
          match: [/.+@.+\..+/, "Please enter a valid email address"],
        },
      },
      {
        timestamps: true, // Adds createdAt and updatedAt fields
        collection: "users", // Explicitly specify the collection name
      }
    );
    
    
    // {
    // email: {type : String, required: true},
    // name: { type: String},
    // username: {type: String, required: true},
    // password:{
    //     type: String,
    //     // required: [true, 'Please Provide a Password'],
    // },
    // description:{
    //     type: String,
    // },
    // profileUrl:{
    //     type: String,
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // updatedAt:{
    //     type: Date,
    //     default: Date.now,
    // }
// });
export default mongoose.models.User || model("User", UserSchema)