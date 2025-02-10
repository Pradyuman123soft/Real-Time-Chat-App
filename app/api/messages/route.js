// Save & Fetch Messages in Next.js Server Actions

import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB"; // ✅ Correct import for default export
import Message from "@/models/Message";

export async function GET() {
  try {
    console.log("🔄 Fetching messages...");
    await connectDB();  // Ensure DB connection
    const messages = await Message.find().sort({ timestamp: 1 }); // Fetch messages in ascending order of timestamp
    console.log("✅ Messages fetched:", messages);
    return NextResponse.json(messages); // Return messages as JSON
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

  
  
  export async function POST(req) {
    try {
      const { sender, receiver, text } = await req.json(); // Ensure parsing is done
  
      if (!sender || !receiver || !text) {
        console.error("Missing required fields.");
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Proceed to save the message if everything is correct
      const newMessage = new Message({ sender, receiver, text });
      await newMessage.save();
  
      return new Response(
        JSON.stringify(newMessage),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("❌ Error occurred in API:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error", message: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
  
  
  
  