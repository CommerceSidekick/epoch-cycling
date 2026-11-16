// Tiny inline markdown for FAQ answers: links and bold only. External links open in a new tab.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function mdInline(src: string) {
  return esc(src)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
      const ext = /^https?:\/\//.test(href);
      return ext
        ? `<a href="${href}" class="link" target="_blank" rel="noopener" data-outbound>${text}<span class="sr-only"> (opens in a new tab)</span></a>`
        : `<a href="${href}" class="link">${text}</a>`;
    });
}
