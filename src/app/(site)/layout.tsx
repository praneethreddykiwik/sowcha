import { getSiteContent } from "@/lib/content";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Public shell. The admin area lives outside this group so it never inherits
 * the marketing navbar or footer.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await getSiteContent();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Navbar settings={settings} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
