import type { Metadata } from "next";
import { posts } from "@/config/journal";
import { JournalIndex } from "./journal-index";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from the SowCha atelier — cloth, plant dye, hand finishing and the thinking behind each piece.",
};

export default function JournalPage() {
  return <JournalIndex posts={posts} />;
}
