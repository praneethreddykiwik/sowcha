import type { Metadata } from "next";
import { TrackForm } from "./track-form";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Follow a SowCha order from the atelier to your door.",
};

export default function TrackPage() {
  return <TrackForm />;
}
