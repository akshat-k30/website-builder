import type { TemplateTheme } from "@/lib/templates"

/**
 * Generated mini-preview of a template's landing/hero — a faithful scaled-down
 * representation (layout, style, colors) rendered with the template's own
 * default theme. Used on the template picker instead of a generic placeholder.
 */
export default function TemplatePreview({ templateId, theme }: { templateId: string; theme: TemplateTheme }) {
  const p = theme.primaryColor
  const s = theme.secondaryColor
  const bg = theme.backgroundColor
  const tx = theme.textColor
  const grad = `linear-gradient(120deg, ${p}, ${s})`

  const wrap: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    backgroundColor: bg,
    color: tx,
  }

  if (templateId === "bold-developer") {
    return (
      <div style={wrap}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 12, padding: 18, height: "100%", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 9, color: "#27c93f" }}>$ whoami</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, lineHeight: 1, marginTop: 4, background: grad, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Alex Morgan</div>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 9, marginTop: 6, opacity: 0.7 }}>building the web_</div>
          </div>
          <div style={{ background: "#05070d", borderRadius: 8, border: `1px solid ${tx}22`, overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 4, padding: "6px 8px", background: "#0a0e17" }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: "#ff5f56" }} />
              <span style={{ width: 6, height: 6, borderRadius: 99, background: "#ffbd2e" }} />
              <span style={{ width: 6, height: 6, borderRadius: 99, background: "#27c93f" }} />
            </div>
            <div style={{ padding: 8, fontFamily: "'Fira Code', monospace", fontSize: 8, lineHeight: 1.7 }}>
              <div><span style={{ color: "#ff7b72" }}>const</span> <span style={{ color: "#79c0ff" }}>dev</span> = {"{"}</div>
              <div style={{ paddingLeft: 8 }}><span style={{ color: "#7ee787" }}>name</span>: <span style={{ color: "#a5d6ff" }}>&quot;Alex&quot;</span></div>
              <div>{"}"};</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (templateId === "executive-pro") {
    return (
      <div style={wrap}>
        <div style={{ display: "grid", gridTemplateColumns: "34% 1fr", height: "100%" }}>
          <div style={{ background: `color-mix(in srgb, ${p} 6%, ${bg})`, borderRight: `1px solid ${tx}14`, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: grad }} />
            <div style={{ fontWeight: 800, fontSize: 12 }}>Alex Morgan</div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 4, height: 4, borderRadius: 99, background: p }} />
                <span style={{ height: 4, width: 40, borderRadius: 3, background: `${tx}22` }} />
              </div>
            ))}
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ height: 4, width: 40, borderRadius: 3, background: p, marginBottom: 8 }} />
            <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>Executive leader &amp; founder</div>
            <div style={{ height: 4, width: "80%", borderRadius: 3, background: `${tx}20`, marginTop: 8 }} />
            <div style={{ height: 4, width: "60%", borderRadius: 3, background: `${tx}20`, marginTop: 5 }} />
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ flex: 1, padding: 8, borderRadius: 6, border: `1px solid ${tx}14` }}>
                  <div style={{ color: p, fontWeight: 900, fontSize: 13 }}>12</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (templateId === "creative-portfolio") {
    return (
      <div style={{ ...wrap, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 9, color: p, textTransform: "uppercase", letterSpacing: 1 }}>Designer</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 30, lineHeight: 0.95, marginTop: 4 }}>Alex Morgan</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 11, opacity: 0.7, marginTop: 8 }}>Crafting timeless work</div>
        <div style={{ width: 60, height: 1, background: `${tx}40`, marginTop: 12 }} />
      </div>
    )
  }

  if (templateId === "aurora-gradient") {
    return (
      <div style={wrap}>
        <div style={{ position: "absolute", inset: "-20%", filter: "blur(28px)", background: `radial-gradient(40% 40% at 20% 20%, ${p}, transparent 70%), radial-gradient(40% 40% at 82% 30%, ${s}, transparent 70%), radial-gradient(45% 45% at 60% 90%, ${p}, transparent 70%)` }} />
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16 }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: p, background: `color-mix(in srgb, ${p} 14%, transparent)`, padding: "3px 10px", borderRadius: 99, border: `1px solid ${p}44` }}>Creative</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 30, lineHeight: 0.95, marginTop: 8, background: grad, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Alex Morgan</div>
          <div style={{ height: 4, width: 110, borderRadius: 3, background: `${tx}22`, marginTop: 10 }} />
          <div style={{ marginTop: 10, padding: "6px 16px", borderRadius: 8, background: grad, color: "#fff", fontSize: 9, fontWeight: 700 }}>Let&apos;s talk</div>
        </div>
      </div>
    )
  }

  if (templateId === "noir-luxe") {
    return (
      <div style={{ ...wrap, display: "flex", flexDirection: "column", justifyContent: "center", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: p, textTransform: "uppercase", fontSize: 8, letterSpacing: 2 }}>
          <span style={{ width: 24, height: 1, background: p }} /> Portfolio
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 32, lineHeight: 0.9, marginTop: 8 }}>Alex Morgan</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 11, opacity: 0.65, marginTop: 8 }}>Selected & refined work</div>
        <div style={{ height: 1, width: "100%", background: `${tx}22`, marginTop: 14 }} />
      </div>
    )
  }

  // modern-minimal (default)
  return (
    <div style={wrap}>
      <div style={{ position: "absolute", top: "-30%", left: "-15%", width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, ${p}, transparent 70%)`, filter: "blur(24px)", opacity: 0.5 }} />
      <div style={{ position: "absolute", bottom: "-30%", right: "-10%", width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle, ${s}, transparent 70%)`, filter: "blur(24px)", opacity: 0.5 }} />
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16 }}>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: p }}>Designer</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: 28, lineHeight: 1, marginTop: 6, background: `linear-gradient(100deg, ${p}, ${s})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Alex Morgan</div>
        <div style={{ height: 4, width: 100, borderRadius: 3, background: `${tx}22`, marginTop: 10 }} />
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <span style={{ padding: "5px 14px", borderRadius: 8, background: p, color: theme.primaryColor === bg ? tx : "#fff", fontSize: 9, fontWeight: 700 }}>Contact</span>
          <span style={{ padding: "5px 14px", borderRadius: 8, border: `1px solid ${tx}22`, fontSize: 9, fontWeight: 700 }}>Work</span>
        </div>
      </div>
    </div>
  )
}
