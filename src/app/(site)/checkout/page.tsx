import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { settings } = await getSiteContent();

  return (
    <CheckoutForm
      shippingFlatCents={settings.shippingFlatCents}
      freeShippingThresholdCents={settings.freeShippingThresholdCents}
      codEnabled={settings.codEnabled}
      bankTransferEnabled={settings.bankTransferEnabled}
      bankTransferNote={settings.bankTransferNote}
      email={settings.email}
    />
  );
}
