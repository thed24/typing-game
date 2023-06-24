import { WikipediaPageResult } from "../types/wikipediaPageResult";
import { TypingBox } from "./typingBox";

export const Typing = async () => {
  const paragraph = await getParagraph();

  return <TypingBox paragraph={paragraph?.extract ?? null} />;
};

async function getParagraph(): Promise<WikipediaPageResult | null> {
    const response = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/muffin?redirect=false");
    const data = await response.json();
    return data as WikipediaPageResult | null;
}