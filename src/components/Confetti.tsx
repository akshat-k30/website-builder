"use client"

/**
 * Dependency-free CSS confetti burst. Particles are generated once at module
 * load with a seeded PRNG (deterministic → satisfies React purity lint).
 */
const COLORS = ["#4361ee", "#7c3aed", "#06b6d4", "#f72585", "#f77f00", "#06d6a0", "#ffd166"]

function makeRng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = makeRng(24601)
const PARTICLES = Array.from({ length: 70 }).map((_, i) => ({
  left: rng() * 100,
  delay: rng() * 2.2,
  duration: 2.6 + rng() * 2.4,
  size: 6 + Math.floor(rng() * 8),
  color: COLORS[i % COLORS.length],
  spin: `${540 + Math.floor(rng() * 720)}deg`,
  rounded: rng() > 0.5,
}))

export default function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
            // custom prop consumed by the confetti-fall keyframe
            ["--spin" as string]: p.spin,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
