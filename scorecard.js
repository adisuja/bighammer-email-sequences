/* scorecard.js — shared benchmark scorecard engine. Loads data.js (window.PREVIEW_DATA) and a channel RUBRIC
   (window.RUBRIC = { intro, criteria:[{id,label,weight,how,score(cell,ctx)->{s:1..5,why}}], items(D)->[{cell,label,group}],
   benchmarks:[{metric,value,source,url,note}], projections:[{label,value,basis}], notes:[...] }).
   Every headline number is computed from the per-message table below it; nothing is asserted. */
(function () {
  const D = window.PREVIEW_DATA, R = window.RUBRIC;
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const fill = (t) => String(t ?? "").replace(/\{\{([\w.]+)\}\}/g, (m, k) => D.tokens[k] ?? m);
  const words = (t) => String(t).trim().split(/\s+/).filter(Boolean).length;
  const URL_RE = /(https?:\/\/[^\s<]+|\b(?:[a-z0-9-]+\.)+(?:com|ai|io|net|org|co)\b(?:\/[^\s<]*)?)/gi;
  window.SC = { esc, fill, words, URL_RE };

  const items = R.items(D);
  const totalW = R.criteria.reduce((a, c) => a + c.weight, 0);
  const rows = items.map(it => {
    const scores = R.criteria.map(c => { const r = c.score(it.cell, it); return { id: c.id, s: Math.max(1, Math.min(5, r.s)), why: r.why }; });
    const total = scores.reduce((a, s, i) => a + s.s * R.criteria[i].weight, 0) / totalW;
    return Object.assign({ scores, total }, it);
  });
  const avg = rows.reduce((a, r) => a + r.total, 0) / rows.length;
  const groups = [...new Set(rows.map(r => r.group))].map(g => { const rs = rows.filter(r => r.group === g); return { g, avg: rs.reduce((a, r) => a + r.total, 0) / rs.length, n: rs.length }; });
  const weakest = R.criteria.map((c, i) => ({ c, avg: rows.reduce((a, r) => a + r.scores[i].s, 0) / rows.length })).sort((a, b) => a.avg - b.avg);

  const grade = (x) => x >= 4.5 ? "A" : x >= 4 ? "A−" : x >= 3.5 ? "B+" : x >= 3 ? "B" : x >= 2.5 ? "C+" : x >= 2 ? "C" : "D";
  const pill = (s) => `<span class="sc-pill s${Math.round(s)}">${s.toFixed(1)}</span>`;

  const head = `<section class="sc-hero"><div class="sc-big"><div class="sc-num">${avg.toFixed(2)}<small>/ 5</small></div><div class="sc-grade">${grade(avg)}</div><div class="sc-cap">Weighted average across ${rows.length} messages, computed from the table below (${R.criteria.length} criteria).</div></div>
    <div class="sc-groups">${groups.map(g => `<div class="sc-group"><div class="sc-gname">${esc(g.g)}</div><div class="sc-gval">${g.avg.toFixed(2)}</div><div class="sc-gsub">${g.n} message${g.n > 1 ? "s" : ""}</div></div>`).join("")}</div>
    <div class="sc-weak"><b>Weakest criteria across the set:</b> ${weakest.slice(0, 3).map(w => `${esc(w.c.label)} (${w.avg.toFixed(1)})`).join(" · ")}. <b>Strongest:</b> ${weakest.slice(-2).reverse().map(w => `${esc(w.c.label)} (${w.avg.toFixed(1)})`).join(" · ")}.</div></section>`;

  const table = `<section class="sc-sec"><h2>Per-message scores</h2><p>${esc(R.intro)}</p><div class="sc-tw"><table class="sc-table"><thead><tr><th>Message</th>${R.criteria.map(c => `<th title="${esc(c.how)}">${esc(c.label)}<br><small>× ${c.weight}</small></th>`).join("")}<th>Total</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td class="sc-msg"><b>${esc(r.label)}</b><br><small>${esc(r.group)}${r.meta ? " · " + esc(r.meta) : ""}</small></td>${r.scores.map(s => `<td>${pill(s.s)}<div class="sc-why">${esc(s.why)}</div></td>`).join("")}<td><b class="sc-tot">${r.total.toFixed(2)}</b></td></tr>`).join("")}
    </tbody></table></div></section>`;

  const crit = `<section class="sc-sec"><h2>How each criterion is scored</h2><ul class="sc-crit">${R.criteria.map(c => `<li><b>${esc(c.label)}</b> (weight ${c.weight}) — ${esc(c.how)}</li>`).join("")}</ul></section>`;

  const bench = `<section class="sc-sec"><h2>Benchmarks used</h2><p>Ranges are shown where sources disagree. Every figure links to the page it came from; figures were gathered on ${esc(D.linkCheckedAt)}.</p><table class="sc-bench"><thead><tr><th>Metric</th><th>Benchmark</th><th>Source</th></tr></thead><tbody>${R.benchmarks.map(b => `<tr><td>${esc(b.metric)}</td><td>${esc(b.value)}${b.note ? `<div class="sc-note">${esc(b.note)}</div>` : ""}</td><td><a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.source)}</a></td></tr>`).join("")}</tbody></table></section>`;

  const proj = R.projections && R.projections.length ? `<section class="sc-sec sc-judg"><h2>Projection (judgment, not measurement)</h2><p>These are estimates that combine the benchmarks above with the scores in the table. They are labelled as judgment because no send has happened yet.</p><table class="sc-bench"><thead><tr><th>What</th><th>Estimate</th><th>Basis</th></tr></thead><tbody>${R.projections.map(p => `<tr><td>${esc(p.label)}</td><td><b>${esc(p.value)}</b></td><td>${esc(p.basis)}</td></tr>`).join("")}</tbody></table></section>` : "";

  const notes = R.notes && R.notes.length ? `<section class="sc-sec"><h2>Fix list (ordered by impact)</h2><ol class="sc-notes">${R.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ol></section>` : "";

  document.getElementById("sc").innerHTML = head + table + crit + bench + proj + notes;
})();
