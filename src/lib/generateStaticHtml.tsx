import { renderToString } from "react-dom/server.browser"
import type { ComponentType } from "react"
import { WebsiteContent } from "@/types/website"
import { TemplateTheme } from "@/lib/templates"

// We must import the templates directly (not via next/dynamic) for server-side rendering to string
import ModernMinimal from "@/components/templates/ModernMinimal"
import BoldDeveloper from "@/components/templates/BoldDeveloper"
import CreativePortfolio from "@/components/templates/CreativePortfolio"
import ExecutivePro from "@/components/templates/ExecutivePro"
import AuroraGradient from "@/components/templates/AuroraGradient"
import NoirLuxe from "@/components/templates/NoirLuxe"

type TemplateComponent = ComponentType<{ content: WebsiteContent; theme: TemplateTheme }>

const templateMap: Record<string, TemplateComponent> = {
  "modern-minimal": ModernMinimal,
  "bold-developer": BoldDeveloper,
  "creative-portfolio": CreativePortfolio,
  "executive-pro": ExecutivePro,
  "aurora-gradient": AuroraGradient,
  "noir-luxe": NoirLuxe,
}

export function generateStaticHtml(
  content: WebsiteContent,
  theme: TemplateTheme,
  templateId: string
): string {
  const TemplateComponent = templateMap[templateId] || templateMap["modern-minimal"]

  // Render the React component to an HTML string
  const renderedComponent = renderToString(
    <div className="min-h-screen">
      <TemplateComponent content={content} theme={theme} />
      {/* Powered by footer */}
      <div
        className="py-3 text-center text-[11px] font-semibold tracking-wide opacity-40"
        style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
      >
        Powered by{" "}
        <span className="underline">WebsiteBuilder</span>
      </div>
    </div>
  )

  // Wrap the component in a full HTML shell with Tailwind CDN
  const htmlShell = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.hero?.name || "Portfolio"}</title>
  <meta name="description" content="${content.hero?.tagline || "Professional Portfolio"}">
  
  <!-- Tailwind CSS via CDN for styling the exported static site -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Add any required fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <style>
    body {
      font-family: ${theme.fontFamily || "'Inter', sans-serif"};
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="root">${renderedComponent}</div>
  <script>
    window.addEventListener('load', function() {
      // Small delay to ensure Tailwind CDN has fully injected the styles and layout is established
      setTimeout(() => {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        
        document.querySelectorAll('.css-reveal:not(.is-visible)').forEach((el) => {
          observer.observe(el);
        });
      }, 150);
    });
  </script>
</body>
</html>`

  return htmlShell
}
