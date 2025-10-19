"use client";

import React from "react";
import { getUser, fetchUser, fetchUserById } from "@/actions/useractions";
import { useState, useEffect } from "react";
import { Home, LayoutDashboard, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import useSocket from "@/hooks/useSocket";


export default function home() {
  // const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [selectdUser, setSelectdUser] = useState(null);
  const [expanded, setExpanded] = useState(false); //for sidebar icons
  const route = useRouter();
  const [searchQuery, setSearchQuery] = useState(""); // Store the search input
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useSocket();
  const token = localStorage.getItem("token")
  // const decoded = jwtDecode(token)
  const [user, setUser] = useState(null)

  // ✅ Fix: Ensure session exists before accessing session.user.email
  const sender = user?.email || "";

  const menuItems = [
    { name: "Home", icon: <Home size={24} />, route: "/", path: "/" },
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={24} />,
      route: "/dashboard",
      path: "/dashboard",
    },
    {
      name: "Chat",
      icon: <MessageCircle size={24} />,
      route: "/home",
      path: "/home",
    },
  ];

  useEffect(() => {
    if (!token) {
      route.push("/login")
      console.log("Token is Expired")
    }
    const getUsers = async () => {
      try {
        const data = await fetchUser();
        setUsers(data || []); // Ensure it's always an array
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    getUsers();

    const fetchMessage = async () => {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) {
          throw new Error("Failed to Fetch messages");
        }
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("❌ Error fetching messages: ", error);
      }
    };
    fetchMessage();
    FetchData()
    if (socket) {
      socket.on("message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket?.off("message");
    };
  }, [socket, token]);


    async function FetchData() {
        try {
          const userData = await getUser(token);
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error("Error fetching user", error)
          localStorage.removeItem("token")
          route.push("/login")
        }
      }

  // lets save the send message in database
  const sendMessage = async () => {
    if (socket && message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Make sure this header is set
        },
        body: JSON.stringify({
          sender: user.email,
          receiver: selectdUser.email,
          text: message,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text(); // Get the HTML response body
        console.error("❌ Error sending message:", errorText);
        alert("Failed to send message. Please try again.");
        return;
      }

      const newMessage = await res.json();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("❌ Error in sending message:", error);
      alert("An error occurred while sending the message.");
    }
  };

  socket?.on("message", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  //   this is all for searchbar
  const handleUserClick = async (userId) => {
    setLoading(true);
    const userData = await fetchUserById(userId);
    setSelectdUser(userData);
    setLoading(false);
  };
  // Function to filter and highlight users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to highlight matched text
  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi"); // Case-insensitive match
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span> // Highlight match
      ) : (
        part
      )
    );
  };

  return (
    <>
  <div className="flex h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
    {/* Sidebar */}
    <div
      className={`transition-all duration-300 ${
        expanded ? "w-56" : "w-20"
      } bg-gray-950 flex flex-col py-6 px-2 shadow-2xl`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <h2
        className={`text-2xl font-bold font-sans text-center mb-10 transition-opacity duration-300 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
      >
        ChatZone
      </h2>

      <div className="flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => route.push(item.path)}
            className="flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
          >
            {item.icon}
            {expanded && <span className="text-base">{item.name}</span>}
          </button>
        ))}
      </div>
    </div>

    {/* Chat Container */}
    <div className="flex flex-1 flex-col bg-gradient-to-tr from-gray-800 to-gray-700">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md">
        <h2 className="text-xl font-bold font-serif">💬 Real-Time Chat</h2>
        <div className="flex items-center gap-3">
          <img
            src={user?.profileUrl || "/default-avatar.png"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-600"
          />
          <p className="font-medium">{user?.name || "User"}</p>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* User List */}
        <div className="w-1/3 bg-gray-900 border-r border-gray-700 flex flex-col p-4">
          <h3 className="text-lg font-semibold mb-4">Users</h3>

          {/* Search Box */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* User List */}
          <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-md rounded-2xl shadow-lg border border-gray-800 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
  {loading ? (
    <p className="text-center text-gray-400 font-medium animate-pulse">
      Loading users...
    </p>
  ) : searchQuery.length > 0 ? ( // When searching
    filteredUsers.length > 0 ? (
      filteredUsers.map((user) => (
        <button
          key={user._id}
          onClick={() => handleUserClick(user._id)}
          className="flex items-center gap-4 p-3 border border-transparent rounded-xl bg-gray-800/60 hover:bg-gradient-to-r from-cyan-600/30 to-blue-700/30 hover:shadow-md hover:border-cyan-700 transition-all duration-200"
        >
          <img
            src={user.profileUrl || "/default-avatar.png"}
            alt="User"
            className="w-12 h-12 rounded-full object-cover border border-gray-700 shadow-md"
          />
          <p className="text-lg font-semibold text-gray-200">
            {highlightText(user.name, searchQuery)}
          </p>
        </button>
      ))
    ) : (
      <p className="text-center text-red-400 font-semibold">
        No users found.
      </p>
    )
  ) : users.length > 0 ? ( // When not searching
    users.map((user) => (
      <button
        key={user._id}
        onClick={() => handleUserClick(user._id)}
        className="flex items-center gap-4 p-3 border border-transparent rounded-xl bg-gray-800/60 hover:bg-gray-800 hover:border-gray-700 hover:shadow-md transition-all duration-200"
      >
        <img
          src={user.profileUrl || "/default-avatar.png"}
          alt="User"
          className="w-12 h-12 rounded-full object-cover border border-gray-700 shadow-md"
        />
        <p className="text-lg font-semibold text-gray-200">{user.name}</p>
      </button>
    ))
  ) : (
    <p className="text-center text-gray-500 font-medium">
      No users available.
    </p>
  )}
</div>

        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-gray-800">
          {/* Selected User Info */}
          {selectdUser ? (
            <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-700 bg-gray-900">
              <img
                src={selectdUser.profileUrl || "/default-avatar.png"}
                alt="user"
                className="w-12 h-12 rounded-full border border-gray-600 object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold">{selectdUser.name}</h4>
                <p className="text-sm text-green-400">● Online</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center flex-1 text-gray-400">
              Select a user to start chatting 💭
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {messages &&
            messages.some(
              (msg) =>
                selectdUser?.email &&
                ((msg.sender === sender &&
                  msg.receiver === selectdUser.email) ||
                  (msg.sender === selectdUser.email &&
                    msg.receiver === sender))
            ) ? (
              messages
                .filter(
                  (msg) =>
                    selectdUser?.email &&
                    ((msg.sender === sender &&
                      msg.receiver === selectdUser.email) ||
                      (msg.sender === selectdUser.email &&
                        msg.receiver === sender))
                )
                .map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender === sender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm ${
                        msg.sender === sender
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-xs opacity-70 block text-right mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-gray-500">
                No messages yet. Start the conversation 👋
              </p>
            )}
          </div>

          {/* Message Input */}
          {selectdUser && (
            <div className="relative w-full bg-gray-900 px-6 py-4 flex items-center border-t border-gray-700">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={sendMessage}
                className="ml-4 bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded-full shadow-lg"
              >
                <img
                  src="/send.png"
                  alt="send"
                  className="w-5 h-5 filter invert"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</>

  );
}





  // <>
    //   <div className="main container rounded-md pl-4 fixed left-24 bg-slate-400 flex flex-col w-3/4 h-screen">
    //     <h2 className="text-xl font-bold p-4 font-serif">Real Time Chat</h2>

    //     <div className="messagedata container flex h-screen">
    //       {/* Sidebar (Fixed Space) */}
    //       <div className="relative">
    //         <div
    //           className={`h-screen bg-gray-900 text-white flex flex-col gap-6 transition-all duration-300 
    //       ${expanded ? "w-48 shadow-lg" : "w-16"}`}
    //           onMouseEnter={() => setExpanded(true)}
    //           onMouseLeave={() => setExpanded(false)}
    //         >
    //           <h3 className={`text-xl font-bold font-sans`}>Icons</h3>
    //           {menuItems.map((item, index) => (
    //             <button
    //               key={index}
    //               className="flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-gray-700"
    //               onClick={() => route.push(item.path)} // Navigate on click
    //             >
    //               {item.icon}
    //               {expanded && <span className="text-lg">{item.name}</span>}
    //             </button>

    //             // <div key={index} className="flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-gray-700">
    //             //   {item.icon}
    //             //   {expanded && <span className="text-lg">{item.name}</span>}
    //             // </div>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Main Content (User List & Chat) */}
    //       <div className="flex w-full h-full bg-slate-200 rounded-md">
    //         {/* Users List - Scrollable */}
    //         <div className="user w-1/3 p-4 flex flex-col gap-4 rounded-lg bg-slate-50 overflow-y-auto h-full">
    //           <h3 className="text-xl font-bold font-sans">Users</h3>

    //           <div className="relative">
    //             <input
    //               type="text"
    //               placeholder="Search..."
    //               value={searchQuery}
    //               onChange={(e) => setSearchQuery(e.target.value)}
    //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //             />
    //             <button className="absolute right-2 top-2 text-gray-500">
    //               🔍
    //             </button>
    //           </div>

    //           {/* Users - Scrollable */}
    //           <div className="flex flex-col gap-4 overflow-y-auto">
    //             {loading ? (
    //               <p className="text-center text-gray-500">Loading users...</p>
    //             ) : searchQuery.length > 0 ? ( // If search is active
    //               filteredUsers.length > 0 ? (
    //                 filteredUsers.map((user) => (
    //                   <button
    //                     key={user._id}
    //                     onClick={() => handleUserClick(user._id)}
    //                     className="flex items-center gap-4 p-3 border rounded-lg hover:bg-blue-100 transition-all duration-200"
    //                   >
    //                     <img
    //                       src={user.profileUrl || "/default-avatar.png"}
    //                       alt="User"
    //                       className="w-12 h-12 rounded-full object-cover bg-gray-200"
    //                     />
    //                     <p className="text-lg font-medium">
    //                       {highlightText(user.name, searchQuery)}
    //                     </p>
    //                   </button>
    //                 ))
    //               ) : (
    //                 <p className="text-center text-red-500 font-bold">
    //                   No users found.
    //                 </p>
    //               )
    //             ) : users.length > 0 ? ( // If no search, show all users
    //               users.map((user) => (
    //                 <button
    //                   key={user._id}
    //                   onClick={() => handleUserClick(user._id)}
    //                   className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-100 transition-all duration-200"
    //                 >
    //                   <img
    //                     src={user.profileUrl || "/default-avatar.png"}
    //                     alt="User"
    //                     className="w-12 h-12 rounded-full object-cover bg-gray-200"
    //                   />
    //                   <p className="text-lg font-medium">{user.name}</p>
    //                 </button>
    //               ))
    //             ) : (
    //               <p className="text-center text-gray-500">
    //                 No users available.
    //               </p>
    //             )}
    //           </div>
    //         </div>

    //         {/* Chat Messages - Non-Scrollable */}
    //         <div className="usermessages w-2/3 flex flex-col">
    //           {/* Active User Info */}
    //           {loading ? (
    //             <p>Loading...</p>
    //           ) : (
    //             selectdUser && (
    //               <div className="userInfo flex gap-4 p-3 bg-slate-50">
    //                 <img
    //                   className="w-12 h-12 rounded-full object-contain bg-black"
    //                   alt="profile pic"
    //                   src={selectdUser.profileUrl}
    //                 />
    //                 <div className="username flex items-center">
    //                   <h4 className="text-xl font-bold">{selectdUser.name}</h4>
    //                 </div>
    //               </div>
    //             )
    //           )}

    //           {/* Messages - Scrollable */}
    //           <div className="MessageContent flex-1 overflow-y-auto p-4">
    //             {!messages && <p>Chat messages go here...</p>}
    //             {/* Chat Messages */}
    //             {messages && (
    //               <div className="border p-4 mb-4 overflow-auto">
    //                 {messages
    //                   .filter(
    //                     (msg) =>
    //                       selectdUser?.email && // Ensure selectedUser is not null
    //                       ((msg.sender === sender &&
    //                         msg.receiver === selectdUser.email) ||
    //                         (msg.sender === selectdUser.email &&
    //                           msg.receiver === sender))
    //                   )
    //                   .map((msg) => (
    //                     <div
    //                       key={msg._id}
    //                       className={`message ${
    //                         msg.sender === sender ? "sent" : "received"
    //                       }`}
    //                     >
    //                       <div className="message-content">
    //                         <p>{msg.text}</p>
    //                       </div>
    //                       <style jsx>{`
    //                         .message.sent {
    //                           justify-content: flex-end;
    //                         }

    //                         .message.received {
    //                           justify-content: flex-start;
    //                         }
    //                         .message-content {
    //                           max-width: 60%;
    //                           padding: 10px;
    //                           border-radius: 8px;
    //                           background-color: #f1f1f1;
    //                         }

    //                         .message.sent .message-content {
    //                           background-color: #007bff;
    //                           color: white;
    //                           align-self: flex-end;
    //                         }

    //                         .message.received .message-content {
    //                           background-color: #f1f1f1;
    //                           color: #000;
    //                           align-self: flex-start;
    //                         }
    //                       `}</style>
    //                     </div>
    //                   ))}
    //               </div>
    //             )}
    //           </div>

    //           {/* Type Message Input - Stretched Inside */}
    //           <div className="typemesage w-full bg-white p-4 shadow-md">
    //             <div className="relative w-full">
    //               <input
    //                 type="text"
    //                 value={message}
    //                 onChange={(e) => setMessage(e.target.value)}
    //                 placeholder="Type a message..."
    //                 className="w-full px-4 py-2 mb-16 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //               />
    //               <button
    //                 className="absolute right-2 top-2 text-gray-500"
    //                 onClick={sendMessage}
    //               >
    //                 <img src="/send.png" alt="send message" className="w-8" />
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>