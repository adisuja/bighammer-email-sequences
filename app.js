/* app.js — email channel renderer: every cell is an email rendered in Gmail for iOS (opened conversation or inbox row). */
(function () {
  const C = window.CORE || null;
  window.RENDER = {
    screen(cell) {
      const S = window.PREVIEW_STATE;
      return S.view === "inbox" ? window.GMAIL.inbox(cell) : window.GMAIL.opened(cell);
    },
    screenClass() { return "gmail"; },
    text(cell) {
      const subj = cell.subject ? `Subject: ${cell.subject}\n` : "";
      const pre = cell.preheader ? `Preview text: ${cell.preheader}\n` : "";
      const body = String(cell.body).replace(/\[\[IMG:([^|\]]+)\|([^\]]*)\]\]/g, "[image: $1 · alt: $2]");
      return `${subj}${pre}\n${body}`;
    },
    meta(cell) {
      const core = window.CORE;
      const body = core.sample(cell.body || "");
      const subj = core.sample(cell.subject || "");
      const parts = [`${core.words(body)} words`, `${body.length} chars`, `subject ${subj.length} chars`];
      if (cell.day != null) parts.push(`Day ${cell.day}`);
      parts.push(core.ampm(cell.time || "10:00 am"));
      return parts.join(" · ");
    }
  };
})();
