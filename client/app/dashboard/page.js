"use client";
import React, { useState, useRef, useEffect } from "react";
// import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form"; // Form handling
import { CreateOrUpdateUser, getUser, deleteUser } from "@/actions/useractions"; //get crud operation
import { useRouter } from "next/navigation";

export default function dashboard() {
  // const { data: session } = useSession();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, setValue } = useForm(); // Form handling
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  
 const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


  // fetch user data when compnent mount
  useEffect(() => {
    document.title = "Dashboard - Real Time Chat";
    if (!token) {
      route.push("/login"); // 🚀 Redirect if not logged in
      return;
    }
    else{FetchData();}
  }, [setValue, token]);

  async function FetchData() {
      try {
        const userData = await getUser(token);
        if (userData) {
          setUser(userData);
          setValue("profileUrl", userData.profileUrl);
          setValue("name", userData.name);
          setValue("description", userData.description);
        }
      } catch (error) {
        console.error("Error fetching user", error)
        localStorage.removeItem("token")
        route.push("/login")
      }
      finally{
        setLoading(false);
      }
    }

  // handle form submission (create or update user)
  const onSubmit = async (data) =>{
    const UserData = { ...data, profileUrl: image || user?.profileUrl }; // Store image in MongoDB
    const res = await CreateOrUpdateUser({token, ...UserData});
    if(res.error){
      setMessage("Error in updation or creation")
    }else{
      setUser(res.user);
      setMessage("Signup successfull");
    }
  }

  // handle deletion of form data
  const handleDelete = async () => {
    await deleteUser(token);
    setUser(null);
    setMessage("Deletion successful");
  }

  const RouteClick = async () => {
    if (user && user.name)
     {
      route.push("/Home")
    }else{
      alert("Please fill the details first");
    }
  }

  if (loading) return <p>Loading...</p>; // Show loading state
  if (!user) return <p>Please log in to continue</p>; // If not logged in, show message




  // this process is only for to convert a input file (eg.image) into a encoded URL
  const handleClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader(); //This tool can take a file and convert it into something the browser can understand, like a special URL (called a data URL).
      reader.onloadend = () => {
        setImage(reader.result); //set the image URL as the result from FileReader
      };
      reader.readAsDataURL(file); //convert the file to a data URL
    }
    // console.log(image);
  };

  return (
    <>
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center border border-gray-100">
      <h1 className="font-bold text-3xl text-gray-800 mb-6 text-center">
        Maintain Your Profile
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-6 w-full"
      >
        {/* Profile Image Section */}
        <div className="relative flex flex-col items-center">
          {!image && !user?.profileUrl ? (
            <>
              <input
                type="file"
                ref={fileInputRef}
                name="profileUrl"
                id="profileUrl"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleClick}
                className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white text-4xl font-bold w-28 h-28 flex justify-center items-center rounded-full shadow-md hover:scale-105 transition-transform duration-200"
              >
                +
              </button>
              <p className="text-gray-500 text-sm mt-2">
                Upload your profile picture
              </p>
            </>
          ) : (
            <div className="relative">
              <img
                className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400 shadow-md"
                src={image || user.profileUrl}
                alt="profile pic"
              />
              <button
                type="button"
                onClick={handleClick}
                className="absolute bottom-0 right-0 bg-cyan-500 text-white rounded-full p-1.5 text-xs shadow-md hover:bg-cyan-600 transition"
                title="Change Photo"
              >
                ✎
              </button>
            </div>
          )}
        </div>

        {/* Input Fields */}
        <div className="w-full space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-gray-700 font-semibold mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              {...register("name")}
              value={user.name}
              placeholder="Enter your name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-gray-700 font-semibold mb-1"
            >
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              {...register("description")}
              placeholder="Enter your description"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-gray-700 font-semibold mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              disabled
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-8 py-3 shadow-lg shadow-cyan-500/30 transition"
          >
            Save Changes
          </button>

          <button
            onClick={handleDelete}
            type="button"
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-8 py-3 shadow-lg shadow-red-500/30 transition"
          >
            Delete Data
          </button>

          <button
            onClick={RouteClick}
            type="button"
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-8 py-3 shadow-lg shadow-green-500/30 transition"
          >
            Start Chat
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-6 text-sm text-center text-gray-600 italic">
          {message}
        </p>
      )}
    </div>
  </div>
</>

  );
}

