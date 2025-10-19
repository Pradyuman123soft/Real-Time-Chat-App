// import mongoose from "mongoose";
// import { Schema, model } from "mongoose";

// const MessageSchema = new Schema({
//     sender: String,
//     receiver: String,
//     text: String,
//     timestamp: { type: Date, default: Date.now },
//   },
//   { collection: "messages" });
// export default mongoose.models.MessageSchema || model("Message",MessageSchema)

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
