# DisputeAI — Close Strategy

## The Business Case

### ROI Calculation

| Input | Value |
|-------|-------|
| Average disputes per day | 30 |
| Average resolution time today | 45 minutes |
| Target resolution time with agent | 8 minutes |
| Time saved per dispute | 37 minutes |
| Loaded cost (analyst + overhead) | $55/hour |

**Monthly savings:**
- 30 disputes/day × 22 working days = 660 disputes/month
- 660 × 37 min × ($55/60) = **~$22,300/month in recovered analyst time**
- Plus: faster resolution reduces DSO (days sales outstanding) — disputes that drag 30+ days tie up cash

**12-month contract value:** $22,300/month × 12 = **~$268,000 in identified savings** — before accounting for error reduction (incorrect credits issued manually) and customer churn prevented by faster resolution.

---

## Deal Structure

**Recommended entry point:** Annual contract, starting with the dispute automation module.

- **Month 1–2:** POC + parallel run (covered by POC fee or included in Year 1)
- **Month 3–12:** Production, paying per-dispute or flat monthly — whichever matches their procurement preference
- **Year 2 expansion:** Proactive dispute prevention (flag invoices likely to be disputed before they're sent), carrier scorecard automation, claims processing

**Pricing anchors:**
- Frame against the $22K+/month savings: even at $5K/month, ROI is 4x in Year 1
- Compare to: hiring another AR analyst ($65K/year fully loaded) vs. an agent that handles 20+ disputes/day without training time or turnover

---

## Objection Handling

### "What about data security? We can't send customer invoice data to a third party."

**Response:** The Claude API is SOC 2 Type II certified, and Anthropic does not train on API data by default — your data is never used to improve their models. The agent only sends the specific fields needed for each dispute (invoice ID, charge amount, shipment timestamps) — never bulk exports. We can also offer a private deployment option if compliance requires it. Your legal team can review the data processing agreement before go-live.

---

### "We could build this internally."

**Response:** You absolutely could — and if you have a strong AI engineering team, it's a reasonable option. The real question is: *at what cost and by when?* Based on what we've seen, internal builds for this type of agentic workflow typically take 4–6 months to reach production quality (integration work, prompt engineering, testing against edge cases, compliance review). That's 6 months of disputes still being handled manually, plus an ongoing maintenance burden. We can be running in production in 4 weeks, with your team's input, not their time.

---

### "What if the agent gets it wrong and we issue a credit we shouldn't?"

**Response:** That's exactly why we start with a human-in-the-loop workflow during the parallel run week. The agent drafts the resolution; a human approves before anything is sent or credited. You control the accuracy bar — we don't flip to auto-send until you've seen the numbers and signed off. The pilot is designed to measure exactly this: false credit rate, accuracy per charge type, edge case handling. If the numbers don't hit your threshold, we tune until they do or we tell you it's not ready.

---

### "We're in a budget freeze right now."

**Response:** Understood — timing matters. Two options worth considering: First, the POC is typically a smaller, time-boxed investment. If the parallel run shows the savings, the contract pays for itself within the first month of production — so it can be framed as self-funding rather than a new cost. Second, if this quarter isn't right, let's agree on what the pilot would look like so you're ready to move quickly when the window opens. Disputes aren't slowing down while the budget resets.

---

### "Your competitor offers something similar."

**Response:** Happy to do a head-to-head. The key difference to probe: does their system actually validate charges against *your specific contracts*, or does it apply a generic ruleset? Logistics contracts are idiosyncratic — a 2-hour free detention window at $75/hour vs. a 3-hour window at $65/hour changes the math entirely. DisputeAI is built around your contract terms as the source of truth. Ask them to demo a mixed scenario — one valid charge, one invalid — and see if their agent distinguishes correctly.

---

## Expansion Path (After Year 1)

1. **Proactive dispute prevention:** Agent reviews invoices *before* they're sent and flags charges likely to be disputed based on shipment data and contract terms. Reduces dispute volume by addressing issues upstream.

2. **Carrier performance scoring:** Agent correlates detention patterns with specific carriers and routes. Surface insights to ops team: which carriers are consistently causing detention charges, which routes have highest dispute rates.

3. **Claims automation:** Extend the pattern to freight damage claims — document parsing, carrier liability lookup, settlement recommendation.

4. **Customer-facing portal:** Allow customers to submit disputes directly through a self-service interface, with real-time status updates as the agent investigates.

---

## Champion Enablement

The Ops Manager is your champion. Help them make the internal case:

- **Their talking point to finance:** "This pays for itself in the first month. We're spending $22K/month on analyst time for disputes. This costs $X/month and handles it in a fraction of the time."
- **Their talking point to legal:** "We're not automating the decision — we're automating the research. A human still approves every resolution during the pilot."
- **Their talking point to CIO:** "It's a cloud API, SOC 2 certified, read-only access to our systems except for CRM notes. Lower risk profile than most SaaS tools we've already approved."

Give the champion a one-pager with the ROI numbers and the pilot timeline. Make it easy for them to forward to CFO/CIO without you in the room.
