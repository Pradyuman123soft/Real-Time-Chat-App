"use server";

import connectDB from "@/db/connectDB";
import User from "@/models/User";
import jwt from "jsonwebtoken"

const jwt_secret = process.env.JWT_SECRET

// create or update a user from database
export async function CreateOrUpdateUser(data) {
  try {
    await connectDB(); //connect the mongodb  
    
    const { token, profileUrl, name, description } = data; 
    if(!token) return {error:"Unauthorized user: No Token Provided"}

    let decode;
    try {
      decode = jwt.verify(token, jwt_secret)
    } catch (error) {
      return {error:"Invalid or expired token"}
    }

    const email = decode.email; //email cannot be changed // check if user already exist 
    let user = await User.findOne({ email }); 
    
    if (user) { // update the exist data of user 
      user.profileUrl = profileUrl; 
      user.name = name; 
      user.description = description; 
      await user.save(); 
    } 
    else 
      { user = await User.create({ profileUrl, name, description, email });
  } 
  return { success: "User Data Saved", user };
} catch (error) {
 console.error("Error saving user data", error)
 return {error: "Internal server Error"} 
}
}

// read the user data from database
export async function getUser(token) {
  try {
    
    await connectDB();
    if (!token) return {error:"Unauthorized user: No Token Provide"};
    
    let decode;
    try {
      decode = jwt.verify(token, jwt_secret);
    } catch (error) {
      console.log("Inavlid Token", error)
      return {error:"Invalid or expiry token"}
    }
    // const user = await User.findOne({ email: session.user.email });
    const user = await User.findOne({ email: decode.email }).lean(); // Convert Mongoose object to plain JSON
    return JSON.parse(JSON.stringify(user)); // Ensure it's a plain object
  } catch (error) {
    console.error("Error fetching user", error)
    return {error:"Internal server error"}
  }
  }

// delete the user data from database
export async function deleteUser(token) {
  try {
    
    await connectDB(); // Ensure database connection
    if (!token) return { error: "token is required" };
    
    let decode;
    try {
      decode = jwt.verify(token, jwt_secret)
      
    } catch (error) {
      console.log("Invalid token", error)
      return {error:" Invalid or expiry token "}
  }
  const email = decode.email;
  const user = await User.findOneAndDelete({ email });
  
  if (!user) {
    return { error: "User not found" };
  }
  
  return { success: "User deleted successfully" };
} catch (error) {
  console.log("Error deleting user",error)
  return {error:"Internal server Error"}
}
}
// lets make a api that fetch all the users
export async function fetchUser() {
  try {
    await connectDB();
    const users = await User.find({}).lean();
    // console.log("Fetched Users:", users); // Debugging log

    return JSON.parse(JSON.stringify(users));; // Return the users array
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; 
  }

}
// lets fetch the selecteduser
export async function fetchUserById(userId) {
  try {
    await connectDB();
    const user = await User.findById(userId, "name email profileUrl").lean(); // Convert to plain object

    if (!user) return null;

    return JSON.parse(JSON.stringify(user)); // Ensure it's a plain object
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// // lets save the messages from user
// export async function saveMessages(data){
//   try {
//     const session = await getServerSession(authOptions); // Get logged-in user session
//     await connectDB(); //connect the mongodb
//     if (!session) return { error: "Unauthorized user" };
    
//     const { sender, receiver, text } = data;
//     // const sender = session.user.email;
//     if (!sender || !receiver || !text) {
//     alert("all Fields are required");      
//     }
//     // create a new message to save
//     let message = await Message.create({ sender, receiver, text});
//     return {success: "Message Data saved", message};

//   } catch (error) {
//     console.error("Error: Saving Messages", error);
//     alert("Error comes to save message!")
//     return null;
//   }
// }

// // lets fetch the messages
// export async function fetchMessages(){
//   try {
//     const session = await getServerSession(authOptions); // Get logged-in user session
//     await connectDB(); //connect the mongodb
//     if (!session) return { error: "Unauthorized user" };

//     const messages = await Message.find().sort({ timestamp: 1 }).lean();
//     return JSON.parse(JSON.stringify(messages)); // Ensure it's a plain object
//   } catch (error) {
//     alert("Data Cannot fetched!")
//     console.error("Error: Fetching Messages", error);
//     return null;
    
//   }
// }
