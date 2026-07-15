import React from "react"

interface NavigationProps {
  name: string
  primaryColor: string
  backgroundColor: string
  textColor: string
}

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
]

export default function Navigation({ name, primaryColor, backgroundColor, textColor }: NavigationProps) {

  return (
    <header
      className="css-reveal css-reveal-slideDown"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        padding: "1rem 1rem 0",
        width: "100%",
        animationDuration: "0.6s"
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
          padding: "0.8rem 2rem",
          borderRadius: "100px",
          border: `1px solid ${textColor}0a`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          backgroundColor: `${backgroundColor}cc`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: textColor,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </a>

        {/* Nav Items — hidden on mobile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          className="modern-minimal-nav-items"
        >
          <style>{`
            @media (max-width: 768px) {
              .modern-minimal-nav-items { display: none !important; }
            }
            .css-nav-link {
              font-size: 0.82rem;
              font-weight: 500;
              opacity: 0.55;
              text-decoration: none;
              padding: 0.45rem 0.9rem;
              border-radius: 100px;
              letter-spacing: -0.01em;
              white-space: nowrap;
              transition: all 0.2s ease;
            }
            .css-nav-link:hover {
              opacity: 1;
              background-color: ${textColor}08;
            }
          `}</style>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="css-nav-link"
              style={{ color: textColor }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA dot */}
        <div
          className="css-pulse"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: primaryColor,
            flexShrink: 0,
          }}
        />
      </nav>
    </header>
  )
}
