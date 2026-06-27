import type { Metadata } from "next";
import { BioPageView } from "@/components/bio/BioPageView";
import { buildPageMetadata } from "@/lib/metadata";
import { getBioPageData } from "@/lib/bio-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBioPageData();
  return buildPageMetadata({
    title: `${data.companyName} — Links`,
    description: `${data.description} Catálogo, WhatsApp, Instagram e mais.`,
    path: "/bio",
  });
}

export default async function BioPage() {
  const data = await getBioPageData();
  return <BioPageView data={data} />;
}
