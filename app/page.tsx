import { Typing } from "./components/typing";

export default function Home() {
  return (
  <main className="w-full min-h-screen bg-gray-600"> 
      <div className="mx-auto p-10 flex flex-col items-center">
        <h1 className="font-mono text-6xl">Typing Game</h1>
        <Typing />
      </div>
    </main>
  );
}
