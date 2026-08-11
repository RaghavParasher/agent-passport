# AGENT-PASSPORT — Zero-Trust AI Agent Delegation & Identity Standard

> **AI Passport Ideathon Submission**  
> **Track:** Agents Track | **Lane:** Build Lane  
> **Live Demo:** [https://raghavparasher.github.io/agent-passport/](https://raghavparasher.github.io/agent-passport/)  
> **Repository:** [https://github.com/RaghavParasher/agent-passport](https://github.com/RaghavParasher/agent-passport)

---

## 💡 What is AGENT-PASSPORT?
**AGENT-PASSPORT** is a cryptographically verifiable, scope-bound, and instantly revocable identity and authorization standard for autonomous AI agents.

As AI agents transition from simple chat assistants to autonomous executing entities (committing code, purchasing API credits, deploying containers), granting them static user API keys or broad OAuth tokens creates immense security hazards. **AGENT-PASSPORT** solves this by establishing a zero-trust bearer credential layer between human users, autonomous agents, and target enterprise microservices.

---

## ✨ Key Features & Capabilities

- 🔐 **Ed25519 Cryptographic Signatures**: Signed JWT claim payload carrying delegated human authority proofs.
- 🎯 **Granular Capability Scopes**: Strict parameter bounds (e.g. `github:read_code`, `github:merge_staging`, `cloud:deploy_staging`).
- 💳 **Financial Spend Caps**: Enforces spending limits (e.g. max budget $150.00 USD) with real-time deduction logic.
- 🛑 **Instant Revocation Kill-Switch**: Emergency global revocation hook to instantly shut down compromised or rogue agent credentials across all connected APIs.
- 📊 **Non-Repudiable Audit Ledger**: Full visibility into all authorization checks presented by agents to downstream services.

---

## 🛠️ Architecture & Project Structure

```
agent-passport/
├── index.html          # Main application visualizer & tabbed workspace
├── server.js           # Lightweight static server script
├── css/
│   └── style.css       # Premium glassmorphism UI & dark mode styling
└── js/
    ├── app.js          # Main application orchestrator & DOM bindings
    ├── passport.js     # AIPassport cryptographic class & JWT claim generator
    ├── mockServices.js # Simulated Target APIs (GitHub, AWS, Stripe) verification guard
    ├── agentRunner.js  # Step-by-step agent task execution simulator
    └── devpostContent.js# Complete Devpost submission writeup text exporter
```

---

## 🚀 How to Run Locally

```bash
# Clone repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/agent-passport.git
cd agent-passport

# Run local server using Node.js
node server.js
```
Then open `http://localhost:8080` in your browser.

---

## 🏆 Devpost Submission Criteria Summary

- **Track & Lane**: Agents Track — Build Lane
- **The Problem**: AI agents given master keys risk runaway spending, unauthorized production deploys, and untracked actions.
- **The Solution**: Short-lived, scope-limited AI Passports evaluated at API boundaries.
- **Privacy & Security**: Zero-knowledge credential masking; master user keys are never exposed to third-party endpoints.
