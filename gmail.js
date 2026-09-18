/* gmail.js — Gmail for iOS (2026, Material 3) screens: inbox list row + opened conversation.
   Exposes window.GMAIL. Cells: { id, kinds, day, time, subject, preheader, body, from, prior:[cells], images:[{src,alt}], invite:{...}, newsletter:{...}, unsubscribe:bool } */
(function () {
  const C = window.CORE, esc = C.esc;
  const D = new Proxy({}, { get: (_, k) => C.D[k] });
  const I = {
    back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444746" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>',
    archive: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/></svg>',
    trash: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
    mail: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    mailOutline: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>',
    more: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
    star: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444746" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9L6.7 20l1.1-6L3.4 9.8l6-.8z"/></svg>',
    reply: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#444746"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>',
    replyAll: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#444746"><path d="M7 8V5l-7 7 7 7v-3l-4-4 4-4zm6 1V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>',
    forward: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#444746"><path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/></svg>',
    chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="#444746"><path d="M7.4 8.6L12 13.2l4.6-4.6L18 10l-6 6-6-6z"/></svg>',
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
    chat: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>',
    meet: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
    pencil: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#001d35"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
    cal: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#0b57d0"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>',
    meetLogo: '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#00832d" d="M13.6 12l2.3 2.7 3.1 2 .6-4.7-.6-4.6-3.2 1.7z"/><path fill="#0066da" d="M2 15.3v4c0 .9.7 1.7 1.7 1.7h4l.8-3-.8-2.7-2.7-.8z"/><path fill="#e94235" d="M7.7 3L2 8.7l2.9.8 2.8-.8.8-2.7z"/><path fill="#2684fc" d="M7.7 8.7H2v6.6h5.7z"/><path fill="#00ac47" d="M21.1 6.1l-2.1 1.9v8.4l2.1 1.8c.3.2.9 0 .9-.5V6.5c0-.4-.6-.7-.9-.4zM13.6 12v3.3H7.7V21h9.6c.9 0 1.7-.7 1.7-1.7v-2.6z"/><path fill="#ffba00" d="M17.3 3H7.7v5.7h5.9V12l5.4-4.5V4.7c0-.9-.8-1.7-1.7-1.7z"/></svg>'
  };
  const person = (key) => D.people[key] || D.people.sender;
  const av = (p, size) => `<span class="av" style="width:${size}px;height:${size}px;background:${p.color};font-size:${Math.round(size * .42)}px">${p.photo ? `<img src="${esc(p.photo)}" alt="">` : esc(p.initials)}</span>`;

  /* ---------- body rendering ---------- */
  function bodyHtml(cell) {
    const txt = cell.body || "";
    // Paragraph-aware: blank line = paragraph; single newline kept inside a paragraph (lists, signatures).
    const paras = String(txt).split(/\n{2,}/);
    return paras.map(p => {
      // [[IMG:src|alt]] on its own paragraph = an inline image (hosted, never attached)
      const im = p.match(/^\[\[IMG:([^|\]]+)\|([^\]]*)\]\]$/);
      if (im) return `<figure class="g-img"><img src="${esc(C.sample(im[1]))}" alt="${esc(im[2])}"><figcaption>${esc(im[2])}</figcaption></figure>`;
      // indented block (query listings, code) = monospace block as beehiiv's code block renders it
      if (/^ {2,}\S/.test(p) && p.split("\n").every(l => /^ {2,}|^$/.test(l))) return `<pre class="g-pre">${C.rich(p.replace(/^ {2}/gm, ""), "g-link")}</pre>`;
      return `<p>${C.rich(p, "g-link").replace(/\n/g, "<br>")}</p>`;
    }).join("");
  }
  const preheaderLine = (cell) => cell.preheader ? `<div class="g-preheader">${esc(C.fill(cell.preheader, C.state.mode))}</div>` : "";

  function inviteCard(inv) {
    return `<div class="g-inv">
      <div class="g-inv-top">${I.cal}<div><div class="g-inv-title">${esc(C.fill(inv.title, C.state.mode))}</div><div class="g-inv-when">${esc(inv.when)}</div></div></div>
      ${inv.meet ? `<div class="g-inv-meet">${I.meetLogo}<span>Join with Google Meet</span><small>${esc(inv.meet)}</small></div>` : ""}
      <div class="g-inv-rsvp"><span>Going?</span><b class="g-pill">Yes</b><b class="g-pill">No</b><b class="g-pill">Maybe</b></div>
      <div class="g-inv-foot"><span class="g-link">View in Calendar</span> · <span class="g-link">${esc(inv.icsName || "invite.ics")}</span></div>
    </div>`;
  }

  function newsletterFrame(cell, inner) {
    const n = cell.newsletter;
    return `<div class="bh"><div class="bh-top"><span class="bh-read">Read online</span></div>
      <div class="bh-head"><span class="bh-logo">B</span><span class="bh-name">${esc(n.name)}</span></div>
      <div class="bh-body">${inner}</div>
      <div class="bh-foot"><div>${esc(n.footer)}</div><div class="bh-links"><span class="g-link">Update your preferences</span> · <span class="g-link">Unsubscribe</span></div><div class="bh-addr">${esc(n.address)}</div><div class="bh-powered">Powered by <b>beehiiv</b></div></div></div>`;
  }

  function threadMsg(cell, open) {
    const p = person(cell.from);
    const time = C.ampm(cell.time || "10:00 am");
    if (!open) {
      const snip = C.sample((cell.preheader ? cell.preheader + " " : "") + (cell.snippetOverride || cell.body || "")).replace(/\s+/g, " ");
      return `<div class="g-msg collapsed">${av(p, 40)}<div class="g-msg-main"><div class="g-row1"><span class="g-name">${esc(p.name)}</span><span class="g-time">${esc(time)}</span></div><div class="g-snip">${esc(snip)}</div></div></div>`;
    }
    const unsub = cell.unsubscribe ? `<span class="g-unsub">Unsubscribe</span>` : "";
    let inner = `${cell.invite ? inviteCard(cell.invite) : ""}${preheaderLine(cell)}${bodyHtml(cell)}`;
    if (cell.newsletter) inner = newsletterFrame(cell, inner);
    return `<div class="g-msg open">
      <div class="g-hd">${av(p, 40)}<div class="g-hd-main"><div class="g-row1"><span class="g-name">${esc(p.name)}</span>${unsub}<span class="g-time">${esc(time)}</span></div><div class="g-to">to me ${I.chev}</div></div><span class="g-ic">${I.reply}</span><span class="g-ic">${I.more}</span></div>
      <div class="g-text${cell.newsletter ? " nl" : ""}">${inner}</div>
      ${cell.attachments ? `<div class="g-att">${cell.attachments.map(a => `<span class="g-chip">${I.cal}${esc(a)}</span>`).join("")}</div>` : ""}
      <div class="g-actions"><span class="g-btn">${I.reply}Reply</span><span class="g-btn">${I.replyAll}Reply all</span><span class="g-btn">${I.forward}Forward</span></div>
    </div>`;
  }

  function opened(cell) {
    const subj = C.fill(cell.threadSubject || cell.subject || "(no subject)", C.state.mode);
    const prior = (cell.prior || []).map(pc => threadMsg(pc, false)).join("");
    return `${C.statusBar()}
      <div class="g-top"><span class="g-ic">${I.back}</span><span class="g-sp"></span><span class="g-ic">${I.archive}</span><span class="g-ic">${I.trash}</span><span class="g-ic">${I.mailOutline}</span><span class="g-ic">${I.more}</span></div>
      <div class="scroll g-scroll">
        <div class="g-subj"><div class="g-subj-t">${C.rich(subj, "g-link")}<span class="g-lbl">${esc(cell.label || "Inbox")}</span></div><span class="g-ic">${I.star}</span></div>
        ${prior}${threadMsg(cell, true)}<div style="height:14px"></div>
      </div>
      <div class="g-nav"><span class="g-navi on">${I.mail}</span><span class="g-navi">${I.chat}</span><span class="g-navi">${I.meet}</span></div>
      ${C.home()}`;
  }

  function inboxRow(r, unread) {
    return `<div class="g-irow${unread ? " unread" : ""}">${av(r.p, 40)}<div class="g-irow-main"><div class="g-row1"><span class="g-iname">${esc(r.name)}</span><span class="g-itime">${esc(r.time)}</span></div><div class="g-isubj">${esc(r.subject)}</div><div class="g-row3"><div class="g-isnip">${esc(r.snippet)}</div><span class="g-ic sm">${I.star}</span></div></div></div>`;
  }
  function inbox(cell) {
    const p = person(cell.from);
    const subj = C.fill(cell.threadSubject || cell.subject || "(no subject)", C.state.mode);
    const snip = C.sample((cell.preheader ? cell.preheader + " " : "") + (cell.snippetOverride || cell.body || "")).replace(/\s+/g, " ");
    const count = (cell.prior || []).length + 1;
    const rows = [inboxRow({ p, name: count > 1 ? `${p.name} ${count}` : p.name, time: C.ampm(cell.time || "10:00 am"), subject: subj, snippet: snip }, true)]
      .concat((D.inboxFiller || []).map(f => inboxRow(f, false))).join("");
    return `${C.statusBar()}
      <div class="g-search"><span class="g-ic">${I.menu}</span><span class="g-search-txt">Search in mail</span>${av(D.people.me, 32)}</div>
      <div class="scroll"><div class="g-sec">Primary</div>${rows}</div>
      <div class="g-fab">${I.pencil}<span>Compose</span></div>
      <div class="g-nav"><span class="g-navi on">${I.mail}</span><span class="g-navi">${I.chat}</span><span class="g-navi">${I.meet}</span></div>
      ${C.home()}`;
  }

  window.GMAIL = { opened, inbox, I, av, person };
})();
