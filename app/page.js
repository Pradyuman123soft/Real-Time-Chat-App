import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-[89vh]">
      <img className='h-24' src="/logo.png" alt="message logo" />
      <h1 className="font-bold text-2xl">Real-Time Chat Application</h1>
      <Link href={"/login"}>
      <button type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-8  py-4 mt-3 text-center me-2 mb-2">Start Chat</button>
      </Link>
    </div>
  );
}
// namsteyji