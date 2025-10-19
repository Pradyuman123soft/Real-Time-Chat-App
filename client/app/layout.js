import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";

export const metadata = {
  title: "Real Time Chat Application",
  description: "Created for Live Chats or Messages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
              {children}
            </div>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
