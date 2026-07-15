import React from "react"

interface AnimatedTextProps {
  text: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  variant?: "charReveal" | "wordReveal" | "fadeUp"
  delay?: number
  style?: React.CSSProperties
  className?: string
  staggerDelay?: number
}

export default function AnimatedText({
  text,
  as: Tag = "h1",
  variant = "charReveal",
  delay = 0,
  style,
  className = "",
  staggerDelay,
}: AnimatedTextProps) {

  const words = text.split(" ")
  const chars = text.split("")

  if (variant === "fadeUp") {
    return (
      <Tag
        className={`${className} css-reveal css-reveal-fadeUp`}
        style={{
          ...style,
          animationDelay: `${delay}s`,
          animationDuration: "0.8s"
        }}
      >
        {text}
      </Tag>
    )
  }

  if (variant === "wordReveal") {
    return (
      <Tag className={className} style={{ ...style, display: "flex", flexWrap: "wrap", gap: "0 0.3em" }}>
        {words.map((word, i) => (
          <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
            <span
              className="css-reveal css-reveal-slideUp"
              style={{
                display: "inline-block",
                animationDelay: `${delay + i * (staggerDelay ?? 0.04)}s`,
                animationDuration: "0.6s"
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </Tag>
    )
  }

  // charReveal — default
  return (
    <Tag className={className} style={style} aria-label={text}>
      {chars.map((char, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <span
            className="css-reveal css-reveal-slideUp"
            style={{
              display: "inline-block",
              whiteSpace: char === " " ? "pre" : "normal",
              animationDelay: `${delay + i * (staggerDelay ?? 0.02)}s`,
              animationDuration: "0.5s"
            }}
            aria-hidden="true"
          >
            {char}
          </span>
        </span>
      ))}
    </Tag>
  )
}
