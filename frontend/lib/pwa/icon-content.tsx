/** Arte compartilhada para favicon, apple-icon e ícones do manifest (ImageResponse) */

export function PwaIconContent({ size }: { size: number }) {
  const pad = Math.round(size * 0.12);
  const logoSize = Math.round(size * 0.38);
  const fontSize = Math.round(size * 0.14);
  const subSize = Math.round(size * 0.07);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #FFF8F5 0%, #F7E6DA 50%, #E9C7B5 100%)",
        padding: pad,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: logoSize,
          height: logoSize,
          borderRadius: Math.round(size * 0.22),
          background: "white",
          boxShadow: "0 8px 32px rgba(34,34,34,0.1)",
        }}
      >
        <div
          style={{
            width: Math.round(logoSize * 0.45),
            height: Math.round(logoSize * 0.35),
            border: `${Math.max(2, Math.round(size * 0.02))}px solid #FF6B00`,
            borderRadius: Math.round(size * 0.04),
            background: "#E9C7B5",
            marginBottom: Math.round(size * 0.02),
          }}
        />
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: "#222222",
            letterSpacing: "-0.02em",
          }}
        >
          LM
        </span>
      </div>
      {size >= 192 && (
        <span
          style={{
            marginTop: Math.round(size * 0.06),
            fontSize: subSize,
            fontWeight: 600,
            color: "#FF6B00",
          }}
        >
          Le Maia
        </span>
      )}
    </div>
  );
}
