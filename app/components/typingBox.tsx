'use client'

import { useEffect, useState } from "react";
import { TypingBoxInput } from "./typingBoxInput";

interface Props {
  paragraph: string | null;
}

interface GameState {
  timeRemaining: number;
  wordCount: number;
  gameStarted: boolean;
  paragraph: string[] | null;
}

const newGameState = (started: boolean, paragraph: string[] | null = null): GameState => {
  return {
    timeRemaining: started ? 60 : 0,
    wordCount: 0,
    gameStarted: started,
    paragraph: paragraph,
  };
}

const defaultGameState = newGameState(false);

export const TypingBox = ({ paragraph }: Props) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // Game State
  const onStart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (paragraph) {
      const words = paragraph.split(" ");
      setGameState(newGameState(true, words));
    }
  };

  useEffect(() => {
    if (gameState.gameStarted && gameState.timeRemaining > 0) {
      setTimeout(() => {
        setGameState({
          ...gameState,
          timeRemaining: gameState.timeRemaining - 1,
        });
      }, 1000);
    } else if (gameState.gameStarted && gameState.timeRemaining <= 0) {
      setGameState({
        ...gameState,
        gameStarted: false,
      });
    }
  }, [gameState]);

  return (
    <div className="w-2/3 flex flex-col items-center">
      <TypingBoxInput paragraph={gameState.paragraph} />

      {gameState.gameStarted && (
        <div className="flex flex-col items-center">
          <h4 className="font-mono text-2xl mt-5">Time remaining: {gameState.timeRemaining} seconds</h4>
          <h4 className="font-mono text-2xl mt-5">Word count: {gameState.wordCount}</h4>
        </div>
      )}

      <button
        className="font-mono text-2xl mt-5 bg-gray-300 hover:bg-gray-500 font-bold py-2 px-4 rounded"
        onClick={onStart}
      >
        Start
      </button>
    </div>
  );
}