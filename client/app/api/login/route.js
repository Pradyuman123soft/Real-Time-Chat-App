import connectDB from "@/db/connectDB";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "@/models/User";

const jwt_secret = process.env.JWT_SECRET;

export async function POST(req){
    try {
        await connectDB();

        const {email, password} = await req.json();
        // console.log("📩 Email:", email);
        // console.log("🔑 Password:", password);

        if(!email && !password){
            return new Response(JSON.stringify({message:"missing required filled"}),{status:400})
        }

        const user = await User.findOne({email}).select("+password");
        if(!user){
            console.log("user Not found")
            return new Response(JSON.stringify({message:"user not exists"}),{status:400})
        }
        console.log("👤 User found:", user.email);

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            console.log("Invalid Credentials")
            return new Response(JSON.stringify({message:"invalid email and password"}),{status:402})
        }
        // generate jwt token
        const token = jwt.sign(
            {id:user._id, email:user.email},
            jwt_secret,
            {expiresIn:"1d"}
        )
        // console.log("Token generated:", token);

        // send token
        return new Response(JSON.stringify({
            message:"user logged in successfully",
            token,
            user:user
        }),{status:200})
    } catch (error) {
        console.log("Login error",error)
        return new Response(JSON.stringify({message:"Error Loging in"}),{status404})
    }
}