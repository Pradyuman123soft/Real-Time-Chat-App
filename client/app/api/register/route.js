import connectDB from "@/db/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req){
    try {
        const {name, email, password} = await req.json()
        await connectDB();
        if(!name && !email && !password){
            return new Response(JSON.stringify({message:"fill all the required field"}),{status:402})
        }
        // console.log("Incoming registration request for:", email);
         const existingUser = await User.findOne({email}).select("+password")
        //  console.log("Existing user found:", existingUser);
        if(existingUser){
            return new Response (JSON.stringify({message: "User already exist"}),{status:400})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name:name,
            email:email,
            password: hashedPassword
        })
    //     const token = jwt.sign(
    //         { id: newUser._id, email: newUser.email },
    //         process.env.JWT_SECRET,
    //         { expiresIn: "7d" }
    // );
        return new Response(JSON.stringify({message: "user registered succesfully", user:newUser}),{status:200})
        
    } catch (error) {
        console.log("Error registering", error)
        return new Response(JSON.stringify({message:"user Registering error"}),{status:500});
    }
}