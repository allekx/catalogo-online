type BioBackgroundProps = {
  secondaryColor?: string;
};

export function BioBackground({
  secondaryColor = "#FFF9F5",
}: BioBackgroundProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${secondaryColor} 0%, #FFFCFA 42%, ${secondaryColor} 100%)`,
        }}
      />
      <div className="absolute -left-[22%] top-[6%] h-[58vmin] max-h-[22rem] w-[58vmin] max-w-[22rem] rounded-full bg-[var(--bio-cream-warm,#F7E6DA)]/75 blur-3xl" />
      <div className="absolute -right-[18%] top-[32%] h-[48vmin] max-h-[18rem] w-[48vmin] max-w-[18rem] rounded-full bg-[var(--bio-cream-blush,#E9C7B5)]/45 blur-3xl" />
      <div className="absolute bottom-[8%] left-[8%] h-[38vmin] max-h-[14rem] w-[38vmin] max-w-[14rem] rounded-full bg-maia-rose/25 blur-3xl" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(ellipse 120% 70% at 50% -8%, color-mix(in srgb, var(--bio-primary, #FF6B00) 7%, transparent) 0%, transparent 55%)`,
        }}
      />
    </div>
  );
}
