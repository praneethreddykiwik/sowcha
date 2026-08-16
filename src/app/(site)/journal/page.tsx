import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { JournalIndex } from "./journal-index";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from the SowCha atelier — cloth, plant dye, hand finishing and the thinking behind each piece.",
};

export default async function JournalPage() {
  const { posts, sections } = await getSiteContent();
  return <JournalIndex posts={posts} copy={sections.journal} />;
}
