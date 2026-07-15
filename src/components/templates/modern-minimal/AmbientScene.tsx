import React from "react"

interface AmbientSceneProps {
  primaryColor: string
  secondaryColor: string
}

export default function AmbientScene({ primaryColor, secondaryColor }: AmbientSceneProps) {
  // Convert hex to rgb for rgba usage
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "255, 255, 255"
  }

  const pRgb = hexToRgb(primaryColor)
  const sRgb = hexToRgb(secondaryColor)

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes blobBounce {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .ambient-blob {
              position: absolute;
              filter: blur(80px);
              opacity: 0.4;
              animation: blobBounce 20s infinite ease-in-out alternate;
              z-index: 0;
            }
          `,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          className="ambient-blob"
          style={{
            top: "-10%",
            left: "-10%",
            width: "60vw",
            height: "60vw",
            maxWidth: "600px",
            maxHeight: "600px",
            background: `radial-gradient(circle, rgba(${pRgb}, 0.8) 0%, rgba(${pRgb}, 0) 70%)`,
            animationDelay: "0s",
          }}
        />
        <div
          className="ambient-blob"
          style={{
            bottom: "-20%",
            right: "-10%",
            width: "70vw",
            height: "70vw",
            maxWidth: "800px",
            maxHeight: "800px",
            background: `radial-gradient(circle, rgba(${sRgb}, 0.6) 0%, rgba(${sRgb}, 0) 70%)`,
            animationDelay: "-5s",
          }}
        />
        <div
          className="ambient-blob"
          style={{
            top: "40%",
            left: "50%",
            width: "40vw",
            height: "40vw",
            maxWidth: "500px",
            maxHeight: "500px",
            background: `radial-gradient(circle, rgba(${pRgb}, 0.4) 0%, rgba(${pRgb}, 0) 70%)`,
            animationDelay: "-10s",
          }}
        />
      </div>
    </>
  )
}
