// Inline Markdown-to-HTML helpers for the support site: escaping and auto-linking of URLs and e-mail addresses.
export const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Sentence punctuation after a URL or an address stays outside the link.
export const inline = s => esc(s)
  .replace(/https?:\/\/[^\s)]+/g, m => { const url = m.replace(/[.,;:!?]+$/, ''); return `<a href="${url}">${url}</a>${m.slice(url.length)}`; })
  .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '<a href="mailto:$&">$&</a>');
