"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form"; // Form handling
import { CreateOrUpdateUser, getUser, deleteUser } from "@/actions/useractions"; //get crud operation
import { useRouter } from "next/navigation";

export default function dashboard() {
  const { data: session } = useSession();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const { register, handleSubmit, setValue } = useForm(); // Form handling
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  // fetch user data when compnent mount
  useEffect(() => {
    async function FetchData() {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
        setValue("profileUrl", userData.profileUrl);
        setValue("name", userData.name);
        setValue("description", userData.description);
      }
      setLoading(false);
    }
    FetchData();
  }, [setValue]);

  // handle form submission (create or update user)
  const onSubmit = async (data) =>{
    const UserData = { ...data, profileUrl: image || user?.profileUrl }; // Store image in MongoDB
    const res = await CreateOrUpdateUser(UserData);
    if(res.error){
      setMessage("Error in updation or creation")
    }else{
      setUser(res.user);
      setMessage("Signup successfull");
    }
  }

  // handle deletion of form data
  const handleDelete = async () => {
    await deleteUser();
    setUser(null);
    setMessage("Deletion successful");
  }

  const RouteClick = async () => {
    if (user && register("name"))
     {
      route.push("/Home")
    }else{
      alert("Please fill the details first");
    }
  }

  if (!session) return <p>Please log in</p>; // If not logged in, show message
  if (loading) return <p>Loading...</p>; // Show loading state




  // this process is only for to convert a input file (eg.image) into a encoded URL
  const handleClick = (event) => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader(); //This tool can take a file and convert it into something the browser can understand, like a special URL (called a data URL).
      reader.onloadend = () => {
        setImage(reader.result); //set the image URL as the result from FileReader
      };
      reader.readAsDataURL(file); //convert the file to a data URL
    }
    console.log(image);
  };

  return (
    <>
      <div className="container mx-auto flex flex-col gap-5 items-center">
        <h1 className="font-bold text-2xl ">Maintain Your Profile</h1>
        <div className="form">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
           
            {!image && !user?.profileUrl && (
              <>
                <div className="flex items-center absolute justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    name="profileUrl"
                    onChange={handleFileChange}
                    id="profileUrl"
                    className="opacity-0 w-0 h-0"
                  />
                </div>
                <button
                  type="button"
                  className="bg-slate-500 font-bold text-2xl w-24
        h-24 flex justify-center items-center rounded-full"
                  onClick={handleClick}
                >
                  +
                </button>
              </>
            )}
            {(image || user?.profileUrl) && (
                <>
                  <img
                    className="w-24 h-24  rounded-full object-contain"
                    src={image || user.profileUrl}
                    alt="profile pic"
                  />
                </>
              )}
            
            <div className="flex flex-col">
              <label htmlFor="Full name">Enter your Full name:</label>
              <input
                type="name"
                name="name"
                id="name"
                {...register("name")}
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">Enter your Description:</label>
              <input
                type="description"
                name="description"
                id="description"
                {...register("description")}
                placeholder="Enter your description"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="Full name">Enter your Email-Id:</label>
              <input
                type="email"
                name="email"
                id="email"
                value={session.user.email}
                disabled
              />
            </div>
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-8 py-4 mt-3 text-center me-2 mb-2"
            >
              Submit
            </button>
            <button
             onClick={handleDelete}
              className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-8 py-4 mt-3 text-center me-2 mb-2"
            >
             Delete Data
            </button>
            <button
             onClick={RouteClick}
              className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-8 py-4 mt-3 text-center me-2 mb-2"
            >
             Start chat
            </button>
          </form>
          {message && (
            <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
          )}{" "}
        </div>
      </div>
    </>
  );
}
