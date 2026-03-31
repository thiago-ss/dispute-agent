# Dispute resolution agent — POC plan (2–4 weeks)

## Overview

This document outlines a 4-week plan to take the dispute resolution agent from the current proof-of-concept to a validated pilot running in parallel with your existing dispute resolution process.

**Goal:** Automate resolution of the two highest-volume, most rule-based dispute types — detention charges and fuel surcharge overcharges — and demonstrate measurable time savings and accuracy before expanding scope.

---

## Scope

**In scope (week 1–4):**

- Email-initiated disputes for detention and fuel surcharge charges
- Invoice validation against contracted terms
- Shipment timeline verification
- Automated response drafting
- CRM case update

**Out of scope (phase 2+):**

- Freight rate disputes (require market data integration)
- Claims/damage disputes (require photo/document processing) --- possible escalate scenario to human
- Proactive dispute prevention (flagging invoices before they're sent)

---

## Success criteria

| Metric                                      | Target                                  |
| ------------------------------------------- | --------------------------------------- |
| Dispute resolution time                     | < 10 minutes (from current ~45 min avg) |
| Charge validation accuracy                  | ≥ 85% on historical test cases          |
| Disputes handled end-to-end per day         | 20+                                     |
| Customer satisfaction (CSAT)                | Maintained or improved vs. current      |
| False credit rate (credits issued in error) | < 3%                                    |

---

## Week-by-week plan

### Week 1 — Data & Intake

**Goal:** Connect real data sources so the agent has something to work with.

- **E-mail intake:** Configure Gmail/Outlook API listener on the disputes inbox. Parse inbound e-mails to extract invoice numbers and disputed charge types.
- **Invoice data:** Read-only QuickBooks (or ERP) integration to pull live invoice line items. Replace seed data with real invoices.
- **Contract digitization:** Export top 10 customer contracts to structured JSON (fuel cap %, detention window, accessorial rates, effective dates). Spot-check with AR team.
- **Validation:** Run 20 historical disputes through the agent without sending any responses. Compare agent findings to actual resolutions.

**Stakeholders:** AR Lead (invoice data access), IT/Systems Admin (API credentials)

---

### Week 2 — Shipment data & Accuracy tuning

**Goal:** Feed the agent real shipment timelines so detention validation works on live data.

- **Shipment tracking API:** Integrate with your TMS or carrier API (MacroPoint, FourKites, or carrier-direct) to pull timestamped events (arrival, loading start/end, departure).
- **Edge case handling:** Test against atypical scenarios — multi-stop shipments, partial loads, disputed event timestamps.
- **Prompt refinement:** Review agent reasoning logs from Week 1 validation run. Adjust system prompt and validation logic where accuracy is below target.
- **Accuracy checkpoint:** Run against 50+ historical disputes. Document cases where agent disagreed with human resolution and categorize root cause.

**Stakeholders:** Ops Manager (TMS access), Carrier Relationships (event data quality)

---

### Week 3 — CRM integration & End-to-end testing

**Goal:** Close the loop — agent updates the CRM and sends (or queues for approval) the response e-mail.

- **CRM integration:** Connect to Salesforce/HubSpot/Zendesk (or your system) for case read/write. Agent creates a resolution note and updates case status.
- **E-mail send queue:** Agent-drafted e-mails go to a review queue (Slack/e-mail) for one-click approve/reject. No auto-send yet.
- **End-to-end test:** Run 10 live disputes through the full pipeline in shadow mode (agent resolves, human validates, human sends). Measure accuracy.
- **Rollback plan documented:** Define criteria for pausing the pilot (e.g., accuracy drops below 75% in a given week).

**Stakeholders:** CRM Admin, Legal (review e-mail language), Ops Manager

---

### Week 4 — Parallel run & Measurement

**Goal:** Run agent and human resolvers in parallel on the same dispute queue. Measure everything.

- **Parallel run:** Same disputes processed by both agent and human. Compare: resolution time, accuracy, credit amounts issued.
- **Human-in-the-loop:** Agent handles Tier 1 (standard detention/fuel disputes). Humans handle Tier 2 (complex, high-value, or out-of-scope disputes) — agent routes these automatically.
- **Stakeholder review:** Present parallel run results to Ops Manager, AR Lead, CIO. Go/no-go decision for production.
- **Go-live criteria:** ≥85% accuracy, < 3% false credit rate, customer escalation rate unchanged.

**Stakeholders:** All — this is the decision point.

---

## Stakeholder map

| Stakeholder       | Role                      | Interest                                  | Key Concern                            |
| ----------------- | ------------------------- | ----------------------------------------- | -------------------------------------- |
| Ops Manager       | Daily user                | Wants to stop doing manual lookups        | Will the agent handle edge cases?      |
| AR / Finance Lead | Invoice owner             | Wants accurate credits, faster cash flow  | Risk of issuing incorrect credits      |
| CIO / IT          | Security & infrastructure | API access, data governance               | Where does data go? Who has access?    |
| Legal             | Contract interpretation   | Agent must apply contract terms correctly | Liability if agent misreads a contract |

---

## Data & Security

- **No data leaves your environment.** The agent calls Anthropic's Claude API with only the specific invoice/contract/shipment data needed for each dispute — never bulk exports.
- **Claude API is SOC 2 Type II certified.** Anthropic does not train on API inputs by default.
- **Role-based access:** The agent uses read-only API credentials for invoice and shipment systems. Write access is scoped to CRM case notes only.
- **Audit log:** Every agent action (tool call, finding, e-mail draft) is logged with timestamp, input, and output for compliance review.
- **Reinforcement learning:** The agent will learn from the human feedback and improve its accuracy over time.
