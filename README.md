# Real-Time Chat App

This is a real-time chat application built using **Next.js** with the **app directory**. The app includes user authentication, a dashboard where users can manage their personal information, and a chat page where users can communicate with each other.

## Features

- **User Authentication**: Users can sign up, log in, and access their dashboard.
- **Dashboard**: Users can view and update their personal information, including uploading a profile photo.
- **Chat Functionality**: Users can select another user to chat with. Sent messages appear on the right side, while received messages appear on the left side.
- **Real-Time Messaging**: Messages are stored in **MongoDB** and fetched after refreshing. The chat is updated in real time as users send and receive messages.
- **User Profile**: Each user’s image and name are displayed in the chat selection area, making it easy to start conversations with others.

## Technologies Used

- **Next.js** (App Directory)
- **Tailwind CSS** for styling
- **MongoDB** for data storage (User information and messages)
- **NextAuth.js** for authentication
- **Socket.IO** for real-time messaging
- **Cloudinary** for image uploads (optional, if using cloud storage for profile images)

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd real-time-chat-app
