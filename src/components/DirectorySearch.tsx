"use client"

import { useState, useMemo } from "react"

interface DirectoryMember {
  name: string
  headline: string
  skills: string[]
  subdomain: string
  templateId: string
  tagline: string
}

interface DirectorySearchProps {
  members: DirectoryMember[]
  groupName: string
}

// Deterministic color palette for avatar badges
const AVATAR_COLORS = [
  { bg: "#EEF2FF", text: "#4338CA" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#ECFDF5", text: "#047857" },
  { bg: "#FFF1F2", text: "#BE123C" },
  { bg: "#F0F9FF", text: "#0369A1" },
  { bg: "#FAF5FF", text: "#7E22CE" },
  { bg: "#FFF7ED", text: "#C2410C" },
  { bg: "#F0FDF4", text: "#15803D" },
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function DirectorySearch({ members }: DirectorySearchProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return members
    const q = query.toLowerCase()
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.headline.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q))
    )
  }, [query, members])

  return (
    <>
      {/* Search Bar */}
      <div style={{
        maxWidth: 520,
        margin: "0 auto 48px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          left: 18,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#94a3b8",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "16px 20px 16px 50px",
            fontSize: 15,
            fontFamily: "Inter, sans-serif",
            border: "2px solid #e2e8f0",
            borderRadius: 16,
            outline: "none",
            backgroundColor: "#ffffff",
            color: "#1e293b",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#4361ee"
            e.currentTarget.style.boxShadow = "0 0 0 4px rgba(67,97,238,0.1)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0"
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#f1f5f9",
              border: "none",
              borderRadius: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
              fontSize: 14,
              fontWeight: 700,
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      {query.trim() && (
        <p style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 32,
          fontFamily: "Inter, sans-serif",
        }}>
          {filtered.length === 0
            ? "No members found matching your search."
            : `Showing ${filtered.length} of ${members.length} members`}
        </p>
      )}

      {/* Member Cards Grid */}
      {filtered.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {filtered.map((member) => {
            const color = getAvatarColor(member.name)
            return (
              <MemberCard key={member.subdomain} member={member} color={color} />
            )
          })}
        </div>
      ) : (
        !query.trim() && (
          <div style={{
            textAlign: "center",
            padding: "80px 24px",
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: 8,
              fontFamily: "Inter, sans-serif",
            }}>
              No published websites yet
            </h3>
            <p style={{
              fontSize: 15,
              color: "#64748b",
              maxWidth: 400,
              margin: "0 auto",
              lineHeight: 1.6,
              fontFamily: "Inter, sans-serif",
            }}>
              Members of this group haven&apos;t published their websites yet. Check back soon!
            </p>
          </div>
        )
      )}
    </>
  )
}

function MemberCard({ member, color }: { member: DirectoryMember; color: { bg: string; text: string } }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 20,
        border: hovered ? "1.5px solid rgba(67,97,238,0.3)" : "1.5px solid #e2e8f0",
        padding: 28,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 40px rgba(67,97,238,0.08), 0 8px 16px rgba(0,0,0,0.04)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        cursor: "default",
        display: "flex",
        flexDirection: "column" as const,
        gap: 16,
      }}
    >
      {/* Header: Avatar + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: color.bg,
          color: color.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: "Inter, sans-serif",
          flexShrink: 0,
        }}>
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            fontFamily: "Inter, sans-serif",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap" as const,
          }}>
            {member.name}
          </h3>
          {member.headline && (
            <p style={{
              fontSize: 13,
              color: "#64748b",
              margin: "3px 0 0",
              fontFamily: "Inter, sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap" as const,
            }}>
              {member.headline}
            </p>
          )}
        </div>
      </div>

      {/* Skills */}
      {member.skills.length > 0 && (
        <div style={{
          display: "flex",
          flexWrap: "wrap" as const,
          gap: 6,
        }}>
          {member.skills.slice(0, 5).map((skill) => (
            <span key={skill} style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#4361ee",
              backgroundColor: "rgba(67,97,238,0.08)",
              padding: "4px 10px",
              borderRadius: 8,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.01em",
            }}>
              {skill}
            </span>
          ))}
          {member.skills.length > 5 && (
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#94a3b8",
              padding: "4px 8px",
              fontFamily: "Inter, sans-serif",
            }}>
              +{member.skills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Visit Button */}
      <a
        href={`/sites/${member.subdomain}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "11px 20px",
          backgroundColor: hovered ? "#4361ee" : "#f8fafc",
          color: hovered ? "#ffffff" : "#4361ee",
          border: hovered ? "1.5px solid #4361ee" : "1.5px solid #e2e8f0",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "Inter, sans-serif",
          textDecoration: "none",
          transition: "all 0.25s ease",
          marginTop: "auto",
        }}
      >
        Visit Website
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </a>
    </div>
  )
}
