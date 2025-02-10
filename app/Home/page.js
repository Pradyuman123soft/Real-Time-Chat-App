"use client";

import React from "react";
import { fetchUser, fetchUserById } from "@/actions/useractions";
import { useState, useEffect } from "react";
import { Home, LayoutDashboard, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// import { io } from "socket.io-client";
import useSocket from "@/hooks/useSocket";

//connect to the websocket to the frontend
// const socket = io("http://localhost:3000"); // Use the appropriate WebSocket server URL

export default function home() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [selectdUser, setSelectdUser] = useState(null);
  const [expanded, setExpanded] = useState(false); //for sidebar icons
  const route = useRouter();
  const [searchQuery, setSearchQuery] = useState(""); // Store the search input
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  // ✅ Fix: Ensure session exists before accessing session.user.email
  const sender = session?.user?.email || "";

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
    if (socket) {
      socket.on("message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket?.off("message");
    };
  }, [socket, session]);

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
          sender: session.user.email,
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
      <div className="main container rounded-md pl-4 fixed left-24 bg-slate-400 flex flex-col w-3/4 h-screen">
        <h2 className="text-xl font-bold p-4 font-serif">Real Time Chat</h2>

        <div className="messagedata container flex h-screen">
          {/* Sidebar (Fixed Space) */}
          <div className="relative">
            <div
              className={`h-screen bg-gray-900 text-white flex flex-col gap-6 transition-all duration-300 
          ${expanded ? "w-48 shadow-lg" : "w-16"}`}
              onMouseEnter={() => setExpanded(true)}
              onMouseLeave={() => setExpanded(false)}
            >
              <h3 className={`text-xl font-bold font-sans`}>Icons</h3>
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-gray-700"
                  onClick={() => route.push(item.path)} // Navigate on click
                >
                  {item.icon}
                  {expanded && <span className="text-lg">{item.name}</span>}
                </button>

                // <div key={index} className="flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-gray-700">
                //   {item.icon}
                //   {expanded && <span className="text-lg">{item.name}</span>}
                // </div>
              ))}
            </div>
          </div>

          {/* Main Content (User List & Chat) */}
          <div className="flex w-full h-full bg-slate-200 rounded-md">
            {/* Users List - Scrollable */}
            <div className="user w-1/3 p-4 flex flex-col gap-4 rounded-lg bg-slate-50 overflow-y-auto h-full">
              <h3 className="text-xl font-bold font-sans">Users</h3>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="absolute right-2 top-2 text-gray-500">
                  🔍
                </button>
              </div>

              {/* Users - Scrollable */}
              <div className="flex flex-col gap-4 overflow-y-auto">
                {loading ? (
                  <p className="text-center text-gray-500">Loading users...</p>
                ) : searchQuery.length > 0 ? ( // If search is active
                  filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        className="flex items-center gap-4 p-3 border rounded-lg hover:bg-blue-100 transition-all duration-200"
                      >
                        <img
                          src={user.profileUrl || "/default-avatar.png"}
                          alt="User"
                          className="w-12 h-12 rounded-full object-cover bg-gray-200"
                        />
                        <p className="text-lg font-medium">
                          {highlightText(user.name, searchQuery)}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-red-500 font-bold">
                      No users found.
                    </p>
                  )
                ) : users.length > 0 ? ( // If no search, show all users
                  users.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserClick(user._id)}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      <img
                        src={user.profileUrl || "/default-avatar.png"}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover bg-gray-200"
                      />
                      <p className="text-lg font-medium">{user.name}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No users available.
                  </p>
                )}
              </div>
            </div>

            {/* Chat Messages - Non-Scrollable */}
            <div className="usermessages w-2/3 flex flex-col">
              {/* Active User Info */}
              {loading ? (
                <p>Loading...</p>
              ) : (
                selectdUser && (
                  <div className="userInfo flex gap-4 p-3 bg-slate-50">
                    <img
                      className="w-12 h-12 rounded-full object-contain bg-black"
                      alt="profile pic"
                      src={selectdUser.profileUrl}
                    />
                    <div className="username flex items-center">
                      <h4 className="text-xl font-bold">{selectdUser.name}</h4>
                    </div>
                  </div>
                )
              )}

              {/* Messages - Scrollable */}
              <div className="MessageContent flex-1 overflow-y-auto p-4">
                {!messages && <p>Chat messages go here...</p>}
                {/* Chat Messages */}
                {messages && (
                  <div className="border p-4 mb-4 overflow-auto">
                    {messages
                      .filter(
                        (msg) =>
                          selectdUser?.email && // Ensure selectedUser is not null
                          ((msg.sender === sender &&
                            msg.receiver === selectdUser.email) ||
                            (msg.sender === selectdUser.email &&
                              msg.receiver === sender))
                      )
                      .map((msg) => (
                        <div
                          key={msg._id}
                          className={`message ${
                            msg.sender === sender ? "sent" : "received"
                          }`}
                        >
                          <div className="message-content">
                            <p>{msg.text}</p>
                          </div>
                          <style jsx>{`
                            .message.sent {
                              justify-content: flex-end;
                            }

                            .message.received {
                              justify-content: flex-start;
                            }
                            .message-content {
                              max-width: 60%;
                              padding: 10px;
                              border-radius: 8px;
                              background-color: #f1f1f1;
                            }

                            .message.sent .message-content {
                              background-color: #007bff;
                              color: white;
                              align-self: flex-end;
                            }

                            .message.received .message-content {
                              background-color: #f1f1f1;
                              color: #000;
                              align-self: flex-start;
                            }
                          `}</style>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Type Message Input - Stretched Inside */}
              <div className="typemesage w-full bg-white p-4 shadow-md">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 mb-16 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    className="absolute right-2 top-2 text-gray-500"
                    onClick={sendMessage}
                  >
                    <img src="/send.png" alt="send message" className="w-8" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
