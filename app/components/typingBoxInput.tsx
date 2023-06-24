import React from "react";
import { useMemo, useState, useEffect, useRef } from "react";

interface Props {
  paragraph: string[] | null;
}

interface CaretPosition {
  x: number;
  y: number;
}

export const TypingBoxInput = ({ paragraph }: Props) => {
  const [input, setInput] = useState<string[]>([]);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [wordRefs, setWordRefs] = useState<HTMLSpanElement[]>([]);
  const [caretIndex, setCaretIndex] = useState<CaretPosition>({ x: -1, y: -1 });

  const setWordRef = (index: number) => (ref: HTMLSpanElement | null) => {
    if (!ref) return;

    setWordRefs((prevRefs) => {
      const newWordRefs = [...prevRefs];
      newWordRefs[index] = ref;
      return newWordRefs;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const words = input.split(" ");
    setInput(words);
  };

  const handleWordsClick = () => {
    inputRef?.focus();
  };

  const words = useMemo(() => {
    const colorize = (word: string, index: number) => {
      const matchingWord = input?.[index];
      const isValid = word !== "" && matchingWord !== undefined;

      const isCorrect = isValid && word === matchingWord;
      const isIncorrect = isValid && word !== matchingWord;
      const isNotAttempted = !isValid;

      return isNotAttempted ? "text-gray-400" : isCorrect ? "text-green-400" : isIncorrect ? "text-red-400" : "";
    };

    return (paragraph ?? []).map((word, index) => (
      <React.Fragment key={index}>
        <span ref={setWordRef(index)} className={colorize(word, index)}>
          {word}
        </span>
        <span>&nbsp;</span>
      </React.Fragment>
    ));
  }, [paragraph, input]);

  useEffect(() => {
    if (wordRefs.length > 0 && input.length > 0 && paragraph) {
      const lastWordIndex = input.length - 1;
      const currentWordRef = wordRefs[lastWordIndex];
      const currentWord = input[lastWordIndex];
      const actualCurrentWord = paragraph[lastWordIndex];

      if (currentWordRef) {
        const currentWordRect = currentWordRef.getBoundingClientRect();
        const wordsContainerRect = inputRef?.getBoundingClientRect();

        if (currentWordRect && wordsContainerRect) {
          const wordsContainerLeft = wordsContainerRect.left;
          const wordsContainerTop = wordsContainerRect.top;

          const currentWordLeft = currentWordRect.left;
          const currentWordWidth = currentWordRect.width;
          const currentWordTop = currentWordRect.top;

          const currentCharacterIndex = currentWord.length;
          const characterWidth = currentWordWidth / actualCurrentWord.length;
          const characterOffset = characterWidth * currentCharacterIndex;

          const caretPosition = currentWordLeft - wordsContainerLeft;
          const caretPositionWithCharacterOffsetX = caretPosition + characterOffset;

          const caretPositionY = currentWordTop - wordsContainerTop;

          console.log(caretPositionWithCharacterOffsetX, caretPositionY);

          setCaretIndex({ x: caretPositionWithCharacterOffsetX, y: caretPositionY });
        }
      }
    } else {
      setCaretIndex(-1);
    }
  }, [input]);

  return (
    <div className="w-[1000px] h-full p-2 text-2xl my-10 text-center break-words relative" onClick={handleWordsClick}>
      {caretIndex.x >= 0 && caretIndex.y >= 0 && (
        <span
          className="absolute bg-blue-500 w-1 h-8"
          style={{
            transform: `translate(${caretIndex.x}px, ${caretIndex.y}px)`,
          }}
        ></span>
      )}
      <input
        className="w-[1000px] opacity-0 absolute break-words"
        type="text"
        value={input.join(" ")}
        ref={setInputRef}
        onChange={handleInputChange}
      />
      {words}
    </div>
  );
};
