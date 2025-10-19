"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Login = () => {
const router = useRouter();
  useEffect(() => {
    document.title= "Login - Real Time Chat"
    const token = localStorage.getItem("token")
      if(token){
        router.push('/dashboard');
      }
  }, [router])
 const [isLogin, SetisLogin] = useState(true)
 const [form, Setform] = useState({
  name:"", 
  email:"",
  password:"",
  confirmPassword: ""
 })
//  const router = useRouter();

 const handleLogin = async(e) => {
  e.preventDefault();
  try {
    const res = await fetch('api/login',{
      method: "POST",
      headers:{"content-type":"application/json"},
      body: JSON.stringify({
        email: form.email,
        password: form.password
      }),
    })
  let data;
  try {
    data = await res.json();
  } catch (error) {
    errorData = await res.json();
    console.log(errorData)
    throw new Error("Invalid Server Response");
    
  }
    if(res.ok && data.token){
      localStorage.setItem("token",data.token)
      alert("User logged in succesfully")
      router.push('/dashboard')
    }
    else{
      alert(data.message || "Login Failed")
    }
  } catch (error) {
    console.log("logged in error",error)
  }
   }
    


 const handleRegister = async(e)=>{
   e.preventDefault();
  if(form.password != form.confirmPassword){
    alert("Password doesn't match to confirm Password")
    return;
  }
  try {
    const res = await fetch('api/register',{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password
        
      })
    })
    const data = await res.json();
    if(res.ok){
      alert("user register succesfully")
      SetisLogin(true)
    }
    else{
       alert(`${data.error || "Registration failed"}`);
    }
    
  } catch (error) {
        console.error("Register error:", err);
    alert("Something went wrong, please try again!");
  }
 }


  return (
    <div className='flex justify-center items-center min-h-[89vh]'>
    <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900">
    <div className="grid gap-8">
      <div
        id="back-div"
        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4"
      >
        <div
          className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2"
        >
          <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
            {isLogin?"Login":"Create Account"}
          </h1>
          <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin &&(
              <div>
            <label htmlFor="name" className="mb-2 dark:text-gray-400 text-lg">
              Full Name
            </label>
            <input
              id="name"
              className="border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              type="text"
              placeholder="Enter your full name"
              onChange={(e) => Setform({ ...form, name: e.target.value })}
              required
            />
          </div>
        )}
            <div>
              <label htmlFor="email" className="mb-2  dark:text-gray-400 text-lg">Email</label>
              <input
                id="email"
                className="border p-3 dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                type="email"
                placeholder="Email"
                onChange={(e)=>Setform({...form, email:e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 dark:text-gray-400 text-lg">Password</label>
              <input
                id="password"
                className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                type="password"
                placeholder="Password"
                onChange={(e)=>Setform({...form, password:e.target.value})}
                required
              />
            </div>
            {!isLogin && (
              <div>
            <label htmlFor="confirmPassword" className="mb-2 dark:text-gray-400 text-lg">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              type="password"
              placeholder="Confirm password"
              onChange={(e) => Setform({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>
            )}
            {isLogin &&(
            <Link
              className="group text-blue-400 transition-all duration-100 ease-in-out"
              href={"#"}
            >
              <span
                className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
              >
                Forget your password?
              </span>
            </Link>
            )}
            <button
              className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
              type="submit"
            >
              {isLogin ? "Login":"Register"}
            </button>
          </form>
          <div className="flex flex-col mt-4 items-center justify-center text-sm">
            {isLogin ? (
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => SetisLogin(false)}
              className="text-blue-400 hover:underline transition-all duration-200"
            >
              Sign up here
            </button>
          </p>
        ) : (
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => SetisLogin(true)}
              className="text-blue-400 hover:underline transition-all duration-200"
            >
              Login here
            </button>
          </p>
        )}
          </div>
          <div
            id="third-party-auth"
            className="flex items-center justify-center mt-5 flex-wrap"
          >
            <button
              href={"#"}
              className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
            >
              <img
                className="max-w-[25px]"
                src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                alt="Google"
              />
            </button>
            <button
              href={"#"}
              className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
            >
              <img
                className="max-w-[25px]"
                src="https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/"
                alt="Linkedin"
              />
            </button>
            <button 
              onClick = {()=>{signIn("github")}}
              className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
            >
              <img
                className="max-w-[25px] filter dark:invert"
                src="https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/"
                alt="Github"
              />
            </button>
            <button
              href={"#"}
              className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
            >
              <img
                className="max-w-[25px]"
                src="https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/"
                alt="Facebook"
              />
            </button>
            <button
              href={"#"}
              className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
            >
              <img
                className="max-w-[25px] dark:gray-100"
                src="https://ucarecdn.com/82d7ca0a-c380-44c4-ba24-658723e2ab07/"
                alt="twitter"
              />
            </button>

            <button
              href={"#"}
              className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
            >
              <img
                className="max-w-[25px]"
                src="https://ucarecdn.com/3277d952-8e21-4aad-a2b7-d484dad531fb/"
                alt="apple"
              />
            </button>
          </div>

          <div
            className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"
          >
            <p className="cursor-default">
              By signing in, you agree to our
              <Link
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href={"#"}
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Terms
                </span>
              </Link>
              and
              <Link
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href={"#"}
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Privacy Policy
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  )
}

export default Login
