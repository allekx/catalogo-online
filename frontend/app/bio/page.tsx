import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { buildPageMetadata } from "@/lib/metadata";
import { getBioPageData } from "@/lib/bio-data";

const BioPageView = dynamic(
  () =>
    import("@/components/bio/BioPageView").then((mod) => mod.BioPageView),
  {
    loading: () => (
      <div className="min-h-dvh bg-[#FFF9F5]" aria-label="Carregando bio" />
    ),
  }
);

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
