/* BigHammer.ai EMAIL sequences — copy + sample merge data.
   Source of truth: Google Doc "UPDATED Cold Email", "UPDATED Reminder Emails" and "UPDATED Follow up Emails" tabs (read 19 Sep 2026).
   Edit copy here. Tokens use {{token}} syntax. SEP is what renders where the source copy had an em dash
   (change to ",", "~", " - " etc. in one place). Structure: campaigns → columns (steps, left → right in send order)
   → rows (complete paths / variations) → cells (one screen each). */
(function () {
  const SEP = " - ";
  const T = (s) => String(s).replace(/\s*—\s*/g, SEP);   // every em dash in the source renders as SEP

  const ASSESS = "https://assessment.bighammerops.com";
  const DEMO = "https://calendly.com/bighammer-marketing/your-free-bighammer-ai-demo";
  const WEBINAR = "https://webinar.bighammerai.com/";

  const people = {
    sender: { name: "Srinath Reddy", email: "srinath@bighammer.ai", initials: "S", color: "#5b3fa0" },
    team: { name: "BigHammer.ai", email: "team@bighammer.ai", initials: "B", color: "#0d1b2a" },
    me: { name: "Sarah Mitchell", email: "sarah.mitchell@meridianhealth.com", initials: "S", color: "#0b6e4f" }
  };
  const inboxFiller = [
    { p: { initials: "J", color: "#8a5a2b" }, name: "James Carter", time: "9:12 AM", subject: "Re: Q4 platform roadmap review", snippet: "Thanks Sarah, I've moved the review to Thursday and added the Unity Catalog item." },
    { p: { initials: "E", color: "#3d5a80" }, name: "Emily Watson", time: "8:40 AM", subject: "dbt Cloud renewal quote", snippet: "Attaching the renewal quote we discussed. The seat count went up slightly because" },
    { p: { initials: "D", color: "#b23a48" }, name: "Databricks", time: "Yesterday", subject: "Your workspace usage summary", snippet: "Here is your weekly usage summary for the meridian-prod workspace." }
  ];

  const tokens = {
    first_name: "Sarah",
    company: "Meridian Health",
    title: "Head of Data Platform",
    personalization: "your post last week on Unity Catalog migration eating the quarter made a point I've heard from three other platform leads this month.",
    webinar_date: "Thursday 15 October, 12pm ET",
    webinar_time: "12:00 PM ET",
    webinar_url: WEBINAR,
    assessment_url: ASSESS,
    meme_url: "assets/meme_sarah.png",
    join_url: WEBINAR,   // no join/access link exists yet; falls back to the registration page so the link works
    replay_url: WEBINAR  // no replay page exists yet; falls back to the webinar page
  };

  const previews = {
    "assessment.bighammerops.com": { title: "Reduce Your Databricks Costs up to 75% — BigHammer.ai", domain: "assessment.bighammerops.com" },
    "calendly.com": { title: "BigHammer Ai - Calendly", domain: "calendly.com" },
    "webinar.bighammerai.com": { title: "Reduce Databricks Costs — to 75% — Live Masterclass | BigHammer.ai", domain: "webinar.bighammerai.com" }
  };

  const linkChecks = [
    { url: ASSESS, status: "ok", label: "200 OK · verified visually", note: "Assessment page loads: seven read-only queries, upload-your-CSVs dashboard." },
    { url: DEMO, status: "bad", label: "BROKEN", note: "HTTP 200 but the page renders \"BigHammer Ai — This calendar is currently unavailable.\" Re-enable the event type in Calendly before any demo CTA ships." },
    { url: WEBINAR, status: "warn", label: "200 · stale date in HTML", note: "Loads, but the served HTML still says \"June 18, 2026 · 11:00 AM ET\"; only the in-browser render shows 15 Oct, 12:00 PM ET. Email link previews and crawlers see the June date." },
    { url: "https://bighammer.ai", status: "ok", label: "200 OK · verified visually", note: "Company site. The follow-up signature links here." },
    { url: "{{join_url}}", status: "pending", label: "not live yet", note: "No webinar access / join link exists yet; sample falls back to the registration page." },
    { url: "{{replay_url}}", status: "pending", label: "not live yet", note: "No recording page exists yet; sample falls back to the webinar page." },
    { url: "{{meme_url}}", status: "pending", label: "not hosted yet", note: "Sample uses a locally rendered PNG (assets/meme_sarah.png). Production needs a CDN URL per prospect." }
  ];
  const linkCheckedAt = "19 Sep 2026";

  const kinds = {
    cold: { label: "Cold email", color: "#0b57d0" },
    followup: { label: "Follow-up · reply in thread", color: "#01754f" },
    breakup: { label: "Breakup", color: "#7a4b00" },
    meme: { label: "Meme email", color: "#b8860b" },
    invite: { label: "Registrant invite", color: "#5b3fa0" },
    reminder: { label: "Reminder", color: "#b23a48" },
    post: { label: "Post-masterclass follow-up", color: "#01754f" }
  };

  const T10 = "10:00 am";

  /* ============================== SEQUENCE A — "The Masterclass Invite" ============================== */
  const A1_SUBJ = { a: "the Ferrari-to-the-grocery-store problem", b: "{{company}}'s Databricks bill", c: "a line I keep hearing from data leaders" };
  const A1_PRE = "30 minutes, real numbers, no demo.";
  const A1 = T(`{{first_name}},

{{personalization}}

Slight swerve, but related. I host a masterclass for data leaders called "Reduce Your Databricks Costs up to 75%," and one attendee line keeps coming back verbatim:

"It's like taking a Ferrari to the grocery store."

Nobody has a Databricks problem. They have a bill they can't explain to finance, and a backlog of projects the commit is already blocking.

Last session I put a healthcare firm's real numbers on screen: $308K a year in all-purpose compute nobody was using, $315K burned on jobs that failed three hours in, and $2.74M of Photon markup applied to workloads that got zero speedup from it.

Next session is {{webinar_date}}. 30 minutes of teardown, 15 of Q&A. It's a teardown, not a demo: {{webinar_url}}

If the timing doesn't work, register anyway and I'll send you the recording.

Srinath
Founder & CEO, BigHammer.ai`);

  const A2_SUBJ = "$308K, $315K, $2.74M";
  const A2 = T(`{{first_name}} — the three leaks I walk through in the masterclass, in case they're easier to skim than to attend:

1. The always-on tax. All-purpose compute billing at premium rates through idle developer sessions. That firm: $308K/year.

2. Photon on everything. A 2x multiplier switched on globally, including for simple jobs that got no measurable speedup. Exposure: $2.74M.

3. Compute leakage. Orphaned pipelines and missing task timeouts, burning hours before the job inevitably fails. $315K/year, gone.

None of these show up as a line item. They show up as "why is the bill up again," one quarter later.

Full teardown {{webinar_date}}: {{webinar_url}}

Srinath`);

  const A3_SUBJ = "the projects your commit is blocking";
  const A3 = T(`{{first_name}},

The cost conversation is usually the wrong conversation.

The expensive part isn't the invoice — it's that low-value batch workloads quietly consume the commit, and then the AI/ML and compliance projects that were supposed to justify the platform get pushed to next quarter.

Same healthcare firm: once the low-value workloads were moved to a lower-cost platform, 60% of their blocked backlog was unlocked. $3M+/year in cost avoidance, north of 400% ROI. The savings were the second-best outcome.

I walk through how the workloads get sorted — Keep, Refactor, Retire, or Move — and how you prove parity before cutover, so nobody has to take it on faith.

{{webinar_date}}: {{webinar_url}}

Srinath`);

  const A4_SUBJ = "read-only SQL, no call required";
  const A4 = T(`{{first_name}} — if a webinar isn't your format, take the shortcut instead.

We publish the assessment queries we run ourselves. Read-only, nothing written back, no agent installed. You run them in your own SQL warehouse and you'll see your own version of the three leaks in about an hour.

{{assessment_url}}

Send the output back and I'll tell you what I'd go after first, whether or not you ever come to a session. And if you'd rather just watch someone else's numbers get taken apart first, the next one's {{webinar_date}}: {{webinar_url}}

Srinath`);

  const A5_SUBJ = "closing the loop";
  const A5 = T(`{{first_name}},

I'll stop here — you're clearly not in a cost cycle right now, which is genuinely a good sign.

Two things worth keeping, whether or not we ever speak:

- The read-only assessment queries: {{assessment_url}}
- The masterclass, if it ever becomes urgent: {{webinar_url}}

If the bill ever moves in a direction you have to explain to a CFO, reply to this email and I'll send you the teardown checklist directly.

Srinath
Founder & CEO, BigHammer.ai`);

  /* ============================== SEQUENCE B — "The Meowing Cat" ============================== */
  const B1_SUBJ = { a: "a cat has a message for you", b: "{{first_name}}, this is the least professional email you'll get today", c: "meow" };
  const B1_PRE = "I promise this goes somewhere.";
  const B1 = T(`{{first_name}},

{{personalization}}

[[IMG:{{meme_url}}|{{first_name}}, this cat only meows at people looking to save on Databricks costs]]

Would love to chat - (we have an upcoming webinar too on saving Databricks costs if you're interested: {{webinar_url}}).

Srinath
Founder & CEO, BigHammer.ai`);

  const B2 = T(`{{first_name}} — the cat was the hook. This is the substance.

Three numbers from one healthcare firm's Databricks estate: $308K a year in idle all-purpose compute. $315K burned on jobs that failed hours in. $2.74M of Photon markup on workloads that got no speedup from it.

We take that apart live on {{webinar_date}}: {{webinar_url}}

Worth 30 minutes?

Srinath`);

  const B3_SUBJ = "last meow";
  const B3 = T(`{{first_name}},

Last one from me — the cat has moved on to other prospects.

If you ever want to see where your own Databricks spend is leaking, the read-only queries we use are here, no call attached: {{assessment_url}}

And the masterclass, whenever it's useful: {{webinar_url}}

Srinath`);

  /* ============================== v1 registrant invite ============================== */
  const INV_SUBJ = { a: "Cut your Databricks spend up to 75% — free masterclass, {{webinar_date}}", b: "{{first_name}}, your Databricks bill doesn't have to look like this", c: "AI-powered migration masterclass: 40–75% lower TCO, live walkthrough" };
  const INV = T(`Hi {{first_name}},

I'm hosting a free live masterclass:

"Reduce Your Databricks Costs up to 75%"

{{webinar_date}}

Hosted by Srinath Reddy, Founder & CEO of BigHammer.ai — 20+ years running data platforms and engineering teams for $B+ enterprises. Srinath has led large-scale Databricks and Snowflake cost reduction initiatives firsthand, saving millions in platform spend before building BigHammer.ai to automate it.

What you'll walk away with:
• The Reality — Databricks spend is compounding. The ROI isn't.
• The Hidden Causes — Why up to 70% of your workloads don't need premium Spark — and how they ended up there by default.
• The Framework — Right workload. Right compute. Right cost. How to discover, classify, and prioritise your migration candidates.
• The Solution — Agent Migrate: AI-powered migration to any cloud — no code rewrites, no downtime, up to 75% TCO reduction.
• Real-World Proof — How a healthcare company cut Databricks TCO by 73% in weeks.

Bonus: the first 5 people to book a demo during the session get a $50 Amazon gift card, and the top 3 questions in Q&A win one too.

Save your seat: {{webinar_url}}

See you there,
Srinath Reddy
Founder & CEO, BigHammer.ai`);

  /* ============================== Reminder emails (registrants) ============================== */
  const R0_SUBJ = "Databricks TCO Reduction - Your spot is confirmed, {{first_name}}!";
  const R0 = T(`Dear {{first_name}},

Thank you for registering for "Reduce Your Databricks Costs up to 75%" on {{webinar_date}}.

In this webinar, you'll learn:
• Why 70% of your Databricks workloads can be optimized and how to move them to the right workloads at a fraction of the cost.
• How enterprises are using AI-powered migration to cut Databricks TCO by up to 75% in weeks, without rewriting a single line of code and guardrails in place

You'll walk away with a practical framework for right-sizing your data platform and the confidence to lead the conversation with your team.

What to do next:
1. Mark your calendar: {{webinar_date}}
2. Watch for your webinar access link (sent 24 hours before)
3. Reply and tell us your biggest data engineering challenge:
• #1 Ballooning Databricks costs
• #2 Too many disconnected tools and point solutions
• #3 Trying to increase speed of our data products delivery
• #4 Trying to reduce our labor effort from data engineering

Bonus: the first 5 people to book a Assessment during the session, and the top 3 questions in live Q&A, each win a $50 Amazon gift card.

You will receive reminder emails with access details before we go live.

Best regards,

Srinath Reddy
Founder & CEO, BigHammer.ai`);

  const R2_SUBJ = "2 days out: here's what we'll cover, {{first_name}}";
  const R2 = T(`Dear {{first_name}},

We're two days out from Thursday's session on AI-powered Databricks migration, at {{webinar_time}}.

Here's the run of show, so you know what to bring to the Q&A:

1. Why a large share of your Databricks workloads don't need to run on Databricks, and how to spot which ones
2. What AI-powered migration looks like in practice: moving those workloads without rewriting code, with guardrails in place
3. The numbers from a healthcare client who stood up a full enterprise data platform in 4 months instead of 12, with engineering effort down by roughly three quarters
4. Live Q&A

Most teams walk in assuming this is a pricing negotiation with their vendor. It's usually a workload placement problem, and that's a very different fix. You can start on it without a platform migration or a budget cycle.

Your link: {{join_url}}

Bring a hard question. The best ones make the session better for everyone.

Best,

Srinath Reddy
Founder & CEO, BigHammer.ai`);

  const R1_SUBJ = "Tomorrow at {{webinar_time}}: Don't miss this Data Engineering Webinar, {{first_name}}";
  const R1 = T(`Dear {{first_name}},

Just a reminder, we go live tomorrow at {{webinar_time}}.

In this session, you'll gain:
• The practical roadmap to unifying your data stack without vendor or cloud lock-in
• How data teams are cutting TCO by 40–75% and delivery time by up to 75%
• What a successful migration away from legacy platforms and off Databricks actually looks like
• How to govern AI tool usage across your team without costs spiralling
• How to position yourself as the leader who modernised the stack not the one still firefighting

This is not theory, it's built on 20+ years leading data platforms and engineering teams for enterprises generating $B+ in revenue, managing multi-million dollar cloud infrastructure at exabyte scale and cutting one team's own Databricks and Snowflake spend by 70% annually before founding BigHammer.ai to solve the exact problems you're facing today.

Your webinar link: {{join_url}}

Looking forward to seeing you there.

Best,

Srinath Reddy
Founder & CEO, BigHammer.ai`);

  const RH_SUBJ = "We're going LIVE in 1 hour, {{first_name}}";
  const RH = T(`Dear {{first_name}},

We go live in 1 hour.

In today's webinar, you'll discover:
• Why organisations are burning through AI tokens with next to no value and what the exceptions do differently
• How to consolidate 4–5 point solutions into one unified, cloud- and compute-agnostic platform
• How one healthcare client delivered a full enterprise data platform in 4 months instead of 12, cutting TCO by 73–80% and engineering effort by 75%
• The UNIFY → AUTOMATE → ELEVATE framework and how to apply it to your stack

We'll also host a live Q&A at the end, bring your questions. Top 3 questions win a $50 Amazon gift card, and the first 5 Assessment bookings today get one too.

Join here: {{join_url}}

See you shortly.

Best regards,

Srinath Reddy
Founder & CEO, BigHammer.ai`);

  const RL_SUBJ = "We're LIVE Now! Join the Data Engineering Webinar";
  const RL = T(`Dear {{first_name}},

We've just gone live.

Srinath is now walking through the practical framework data engineering leaders are using to reduce delivery time by up to 75%, cut Databricks and Snowflake costs by 40–75%, and build the trusted data foundation their AI initiatives need, without vendor lock-in and without burning out the team.

If you are serious about modernising your data stack in 2026, this session is essential.

Join the webinar here: {{join_url}}

See you there.

BigHammer.ai Team`);

  /* ============================== Post-masterclass follow-up ============================== */
  const F1_SUBJ = "Masterclass: The 6 patterns behind your exploding Databricks bill";
  const F1_ALT = "what we covered in the masterclass, in one paragraph";
  const F1 = T(`Dear {{first_name}},

Thanks for spending 45 minutes with us last Thursday. If you take away just one thing from the session, make it this:

Runaway Databricks spend is rarely one bad job.

It's 6 Patterns that show up in nearly every environment we assess:

1) Interactive clusters idling overnight at 1-2% CPU
2) Photon switched on by default across simple ETL
3) Failed runs in QA burning full compute cycles
4) Micro-batch jobs spending most of their runtime on cluster spin-up
5) Uncompacted Delta files choking I/O
6) …and no tagging or budget alerts to catch any of it before the invoice lands.

Benchmarks put roughly 70% of Enterprise Databricks workloads on compute they DON'T actually need.

Which of the 6 is costing you most - depends entirely on your environment.

We are very happy to look at it with you. ${DEMO}

Srinath Reddy
Founder & CEO, BigHammer.ai

P.S. We set aside a handful of 1-2-1 Databricks Environment Assessments for people who attended the masterclass. Reply if you do want one and we'll check how many are left.`);

  const F2_SUBJ = "\"our compute bill doubled and nobody can tell me why\"";
  const F2 = T(`Dear {{first_name}},

That quote came from a VP of data platforms at a regional health system, and it got more nods than anything else in the session.

Missed the session? {{replay_url}}

The part worth repeating is the sequence, because teams usually attempt it backwards. First you see the spend, which means querying system.billing_usage and the job cost tables and enforcing tagging hard enough that untagged clusters simply fail to launch. Then you control it: right-size the compute, turn on Delta auto-optimize, schedule OPTIMIZE and ZORDER, kill the idle resources. Only then does governance stick, through compute policies that mandate auto-termination and budget alerts that fire before an overrun compounds.

Doing step three without step one is how most cost programmes quietly die.

We usually run this as an assessment, then a 30-day sprint on the quick wins, then governance.

If you want to see what that looks like against your own environment: ${DEMO}

Reply if you'd rather just ask a question first. Comes straight to me.

Srinath Reddy
Founder & CEO, BigHammer.ai`);

  const F3_SUBJ = "Where the $3M was hiding";
  const F3_ALT = "the healthcare numbers, broken out";
  const F3 = T(`Dear {{first_name}},

We mentioned the healthcare client briefly in the session. Here's the full breakdown, because the shape of it tends to be familiar.

Idle developer sessions on always-on all-purpose compute were costing about $308,000 a year. That one was fixed with 15-minute auto-termination policies.

Photon had been rolled out globally, including across simple I/O tasks where it delivered nothing measurable. At a 2x DBU multiplier, $2.74 million of annual spend was sitting on unvalidated premium markup. We used our migration agent to move those jobs onto standard Spark compute.

And $315,000 a year was going up in smoke on jobs in lower environments that failed 100% of the time. Orphan pipelines, no task timeouts. Alerts and monitors caught them.

Just over $3 million in annual cost avoidance, and none of it required re-platforming. It required knowing which workloads were sitting on the wrong compute.

Or as we put it on the slide: don't run bicycle workloads on Formula 1 infrastructure.

${DEMO}

Srinath Reddy
Founder & CEO, BigHammer.ai`);

  const F4_SUBJ = "what actually happens on the demo";
  const F4_ALT = "45 minutes on your environment";
  const F4 = T(`Dear {{first_name}},

Before people book, they usually want to know three things: what the migration path looks like, what's likely to break, and how quickly the money comes back. So rather than describe the product, here's what the session actually covers.

We walk through see, control and guard against your current Databricks setup. We show you where the TCO reduction comes from in your specific case, whether that's idle waste, Photon sitting where it shouldn't, retry leakage or spin-up overhead. We map out the first 90 days, which is normally a 30-day sprint on quick wins followed by governance. And we show how the migration agent moves jobs and code onto any cloud or compute you like, without locking you into a vendor, a cloud or a model.

${DEMO}

On the objections we get most often, briefly and honestly.

Budget: this usually pays for itself out of reduced spend, which is why we start with an assessment rather than a contract.

Track record: fair question, we're newer than the incumbents. SBC Labs got a full enterprise data platform live in four months without putting a technical engineer on it.

Approved vendor lists: we'll send governance, security, compliance and LLM guardrail documentation up front so procurement has what it needs.

Headcount: nobody's job goes away. The point is getting engineers out of manual ops so they can build something worth building.

No pressure on any of it. Book a slot if it's useful.

Srinath Reddy
Founder & CEO, BigHammer.ai`);

  /* ============================== cell builders ============================== */
  let n = 0;
  const em = (o) => Object.assign({ id: "e" + (++n), from: "sender", time: T10, kinds: ["cold"] }, o);

  // Sequence A rows: three A1 subject lines (follow-ups reply in the same thread) + a standalone-subject path.
  function seqA(rowId, label, subj, standalone) {
    const a1 = em({ subject: subj, preheader: A1_PRE, body: A1, day: 0, kinds: ["cold"] });
    const mk = (subject, body, day, kind) => standalone
      ? em({ subject, body, day, kinds: [kind], threadSubject: subject })
      : em({ subject: "Re: " + subj, threadSubject: subj, body, day, kinds: [kind] });
    const a2 = mk(A2_SUBJ, A2, 3, "followup"), a3 = mk(A3_SUBJ, A3, 6, "followup"), a4 = mk(A4_SUBJ, A4, 9, "followup"), a5 = mk(A5_SUBJ, A5, 13, "breakup");
    if (!standalone) { a2.prior = [a1]; a3.prior = [a1, a2]; a4.prior = [a1, a2, a3]; a5.prior = [a1, a2, a3, a4]; }
    return { id: rowId, label, cells: [a1, a2, a3, a4, a5] };
  }
  function seqB(rowId, label, subj, standalone) {
    const b1 = em({ subject: subj, preheader: B1_PRE, body: B1, day: 0, kinds: ["meme"] });
    const b2 = standalone ? em({ subject: "the cat was the hook", threadSubject: "the cat was the hook", body: B2, day: 4, kinds: ["followup"] })
      : em({ subject: "Re: " + subj, threadSubject: subj, body: B2, day: 4, kinds: ["followup"] });
    const b3 = standalone ? em({ subject: B3_SUBJ, threadSubject: B3_SUBJ, body: B3, day: 8, kinds: ["breakup"] })
      : em({ subject: "Re: " + subj, threadSubject: subj, body: B3, day: 8, kinds: ["breakup"] });
    if (!standalone) { b2.prior = [b1]; b3.prior = [b1, b2]; }
    return { id: rowId, label, cells: [b1, b2, b3] };
  }

  const campaigns = [
    {
      id: "seq-a", title: "Sequence A · \"The Masterclass Invite\" (5 emails / 13 days)", kinds: ["cold", "followup", "breakup"],
      subtitle: "Plain text, no HTML template, no tracking pixel on email 1. A2 to A5 are sent as replies in the same thread (Gmail shows the earlier emails collapsed above the new one). Structure of every email: personalization line → one-line bridge → webinar intro → invite.",
      columns: [
        { id: "a1", label: "Email 1", title: "the Ferrari line", day: "Day 0 · 10 AM" },
        { id: "a2", label: "Email 2", title: "the three leaks", day: "Day 3 · 10 AM" },
        { id: "a3", label: "Email 3", title: "blocked backlog", day: "Day 6 · 10 AM" },
        { id: "a4", label: "Email 4", title: "read-only queries", day: "Day 9 · 10 AM" },
        { id: "a5", label: "Email 5", title: "breakup", day: "Day 13 · 10 AM" }
      ],
      rows: [
        seqA("a-subj-a", "Variation 1 · subject A: the Ferrari-to-the-grocery-store problem", A1_SUBJ.a),
        seqA("a-subj-b", "Variation 2 · subject B: {{company}}'s Databricks bill", A1_SUBJ.b),
        seqA("a-subj-c", "Variation 3 · subject C: a line I keep hearing from data leaders", A1_SUBJ.c),
        seqA("a-standalone", "Variation 4 · standalone subjects (no threading)", A1_SUBJ.a, true)
      ]
    },
    {
      id: "seq-b", title: "Sequence B · \"The Meowing Cat\" (3 emails / 8 days)", kinds: ["meme", "followup", "breakup"],
      subtitle: "Deliberately minimal: the image does the work. The meme PNG is hosted and referenced by URL, never attached; alt text always ships because roughly a third of B2B inboxes block images (use the Images toggle to see that view). Tier 1 to 4 personalization only.",
      columns: [
        { id: "b1", label: "Email 1", title: "the meme", day: "Day 0 · 10 AM" },
        { id: "b2", label: "Email 2", title: "the substance", day: "Day 4 · 10 AM" },
        { id: "b3", label: "Email 3", title: "breakup", day: "Day 8 · 10 AM" }
      ],
      rows: [
        seqB("b-subj-a", "Variation 1 · subject A: a cat has a message for you", B1_SUBJ.a),
        seqB("b-subj-b", "Variation 2 · subject B: {{first_name}}, this is the least professional email you'll get today", B1_SUBJ.b),
        seqB("b-subj-c", "Variation 3 · subject C: meow", B1_SUBJ.c)
      ]
    },
    {
      id: "invite-v1", title: "Registrant invite email · v1 (single send)", kinds: ["invite"],
      subtitle: "The earlier long-form invite from the same tab, with its three subject-line options. Note it uses the older \"AI-Powered Migration\" framing and \"73%\" healthcare figure; the cold sequences above use the current deck's $308K / $315K / $2.74M numbers.",
      columns: [{ id: "i1", label: "Email 1", title: "invite", day: "Day 0 · 10 AM" }],
      rows: [
        { id: "inv-a", label: "Variation 1 · subject A", cells: [em({ subject: INV_SUBJ.a, body: INV, day: 0, kinds: ["invite"] })] },
        { id: "inv-b", label: "Variation 2 · subject B", cells: [em({ subject: INV_SUBJ.b, body: INV, day: 0, kinds: ["invite"] })] },
        { id: "inv-c", label: "Variation 3 · subject C", cells: [em({ subject: INV_SUBJ.c, body: INV, day: 0, kinds: ["invite"] })] }
      ]
    },
    {
      id: "reminders", title: "Webinar reminder emails (registrants)", kinds: ["reminder"],
      subtitle: "From the \"UPDATED Reminder Emails\" tab. Day numbers count back from the live session (Day 0 = webinar day). The source still hard-codes \"30 July 2026, 11:00 AM EST\"; every date/time here is a {{webinar_date}} / {{webinar_time}} token so one edit updates all five.",
      columns: [
        { id: "r0", label: "Email 1", title: "confirmation", day: "On registration · 10 AM" },
        { id: "r2", label: "Email 2", title: "2-day reminder", day: "Day −2 · 10 AM" },
        { id: "r1", label: "Email 3", title: "1-day reminder", day: "Day −1 · 10 AM" },
        { id: "rh", label: "Email 4", title: "1-hour reminder", day: "Day 0 · 11 AM" },
        { id: "rl", label: "Email 5", title: "live now", day: "Day 0 · 12 PM" }
      ],
      rows: [{ id: "rem-path", label: "Path 1 · every registrant", cells: [
        em({ subject: R0_SUBJ, body: R0, day: 0, kinds: ["reminder"], label: "Inbox" }),
        em({ subject: R2_SUBJ, body: R2, day: -2, kinds: ["reminder"] }),
        em({ subject: R1_SUBJ, body: R1, day: -1, kinds: ["reminder"] }),
        em({ subject: RH_SUBJ, body: RH, day: 0, time: "11:00 am", kinds: ["reminder"] }),
        em({ subject: RL_SUBJ, body: RL, day: 0, time: "12:00 pm", from: "team", kinds: ["reminder"] })
      ] }]
    },
    {
      id: "followups", title: "Post-masterclass follow-up (4 emails / 9 days)", kinds: ["post"],
      subtitle: "From the \"UPDATED Follow up Emails\" tab. Email 1 same day, Email 2 two days later, Email 3 at day five, Email 4 at day nine. Registrants who did not attend skip Email 1 and start with Email 2. Every CTA points at the Calendly demo page, which is currently broken (see Link check).",
      columns: [
        { id: "f1", label: "Email 1", title: "the 6 patterns", day: "Day 0 · 10 AM" },
        { id: "f2", label: "Email 2", title: "the quote", day: "Day 2 · 10 AM" },
        { id: "f3", label: "Email 3", title: "where the $3M was hiding", day: "Day 5 · 10 AM" },
        { id: "f4", label: "Email 4", title: "what happens on the demo", day: "Day 9 · 10 AM" }
      ],
      rows: [
        { id: "fu-attended", label: "Path 1 · attended live", cells: [
          em({ subject: F1_SUBJ, body: F1, day: 0, kinds: ["post"], footnote: "Alt subject: " + F1_ALT }),
          em({ subject: F2_SUBJ, body: F2, day: 2, kinds: ["post"] }),
          em({ subject: F3_SUBJ, body: F3, day: 5, kinds: ["post"], footnote: "Alt subject: " + F3_ALT }),
          em({ subject: F4_SUBJ, body: F4, day: 9, kinds: ["post"], footnote: "Alt subject: " + F4_ALT })
        ] },
        { id: "fu-noshow", label: "Path 2 · registered, did not attend (leads with Email 2)", cells: [
          null,
          em({ subject: F2_SUBJ, body: F2, day: 2, kinds: ["post"] }),
          em({ subject: F3_SUBJ, body: F3, day: 5, kinds: ["post"], footnote: "Alt subject: " + F3_ALT }),
          em({ subject: F4_SUBJ, body: F4, day: 9, kinds: ["post"], footnote: "Alt subject: " + F4_ALT })
        ] }
      ]
    }
  ];

  window.PREVIEW_DATA = { channel: "email", SEP, people, inboxFiller, tokens, previews, linkChecks, linkCheckedAt, kinds, campaigns, defaultState: { view: "opened" } };
})();
