import NextAuth from "next-auth";
import User from "@/models/User";
import connectDB from "@/db/connectDB";
import GithubProvider from "next-auth/providers/github"

export const authOptions = NextAuth({
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
    ],
    callbacks: {
        async signIn({user, account,  profile, email, credentials}){
            if(account.provider == "github"){
                // connect the Datebase
                await connectDB();
                // check that user is exist or not
                const currentUser = await User.findOne({email: user.email})
                if(!currentUser){
                    const newUser = new User({
                        email: user.email,
                        name: user.email.split("@")[0],
                    })
                    await newUser.save();
                }
                return true;
            }
        }
    }
});
export {authOptions as GET, authOptions as POST}