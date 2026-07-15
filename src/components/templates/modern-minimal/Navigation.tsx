"use client"

import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState, useCallback } from "react"

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
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 200) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setScrolled(latest > 50)
  })

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        padding: "1rem 1rem 0",
        width: "100%",
      }}
    >
      <motion.nav
        animate={{
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          backgroundColor: scrolled ? `${backgroundColor}cc` : `${backgroundColor}00`,
          boxShadow: scrolled
            ? "0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)"
            : "none",
        }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
          padding: "0.8rem 2rem",
          borderRadius: "100px",
          border: scrolled ? `1px solid ${textColor}0a` : "1px solid transparent",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
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
          `}</style>
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              style={{
                fontSize: "0.82rem",
                fontWeight: 500,
                color: textColor,
                opacity: 0.55,
                textDecoration: "none",
                padding: "0.45rem 0.9rem",
                borderRadius: "100px",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s",
              }}
              whileHover={{
                opacity: 1,
                backgroundColor: `${textColor}08`,
              }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        {/* CTA dot */}
        <motion.div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: primaryColor,
            flexShrink: 0,
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.nav>
    </motion.header>
  )
}
