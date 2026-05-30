import type { Metadata } from "next";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = buildPageMetadata({
  title: "Sobre",
  description: "Conheça a história e o artesanato por trás da Le Maia.",
  path: ROUTES.about,
});

export default function AboutPage() {
  return (
    <div>
      <SectionTitle
        title="Sobre a Le Maia"
        subtitle="Elegância em cada detalhe"
      />
      <div className="space-y-4 font-body text-sm leading-relaxed text-maia-muted">
        <p>
          A Le Maia nasceu da paixão por criar bolsas que transcendem o
          acessório — cada peça é uma expressão de identidade, feita com
          materiais premium e acabamento impecável.
        </p>
        <p>
          Nosso catálogo digital foi pensado para você explorar as peças,
          montar seu pedido no carrinho e finalizar pelo WhatsApp — sem
          cadastro, com a leveza de uma vitrine premium no celular.
        </p>
      </div>
    </div>
  );
}
