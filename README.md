# AGENT-PASSPORT — Zero-Trust AI Agent Delegation & Identity Standard

> **AI Passport Ideathon Submission**  
> **Track:** Agents Track | **Lane:** Build Lane  
> **Live Demo Website:** [https://raghavparasher.github.io/agent-passport/](https://raghavparasher.github.io/agent-passport/)  
> **GitHub Repository:** [https://github.com/RaghavParasher/agent-passport](https://github.com/RaghavParasher/agent-passport)

---

## 🎯 Submission Overview & Core Question Answer

### *Where can AI Passport be used best?*
AI Passport is most urgently needed in **Autonomous AI Agent Delegation**. As AI agents transition from conversational chatbots to active executing entities—committing code to repositories, deploying cloud containers, and purchasing API credits—granting them static, over-privileged master API keys creates immense security hazards. **AGENT-PASSPORT** solves this by establishing a zero-trust, cryptographically verifiable bearer credential layer between human owners, autonomous agents, and target enterprise microservices.

---

## 📋 Comprehensive Devpost Submission Criteria Checklist

### 1. Track & Lane Selection
- **Track:** Agents Track
- **Lane:** Build Lane (Interactive Working Demo & Specification Visualizer)

### 2. The Problem You Are Solving
- **Over-Privileged Master Keys:** Developers currently provision agents with static API keys or admin OAuth tokens. If an agent hallucinates, loops, or is prompt-injected, it can destroy production resources or drain bank accounts.
- **Lack of Real-Time Revocation:** Revoking access currently requires resetting the human user's primary master key, disrupting whole systems.
- **Non-Repudiation Gap:** Audit ledgers cannot distinguish between human actions and autonomous bot actions operating under shared static keys.

### 3. Target User Base
- **Primary Users:** Enterprise Software Developers, DevOps Engineers, AI Agent Builders, and End-Users delegating tasks to autonomous bots (e.g., procurement bots, coding assistants).
- **Secondary Users:** API Service Providers (GitHub, AWS, Stripe) requiring verifiable proof that an incoming automated request originates from an authorized, spend-constrained AI agent rather than a compromised key.

### 4. How AI Passport is Used
1. **Human Delegation & Signing:** A human user issues a short-lived Ed25519-signed AI Passport token bound to a specific agent instance (e.g., `DevOps-AutoDeployer-v4`).
2. **Presentation:** When the agent invokes target APIs (e.g., GitHub REST API or AWS ECS), it presents the passport in the request authorization header.
3. **Perimeter Verification:** API gateways inspect the Ed25519 signature, verify granted capability scopes, enforce remaining spend allowances, and check global revocation status before executing any operation.

### 5. Context, Permissions, Proofs & Access Controls
- **Context Carried:** Agent ID, Human Issuer ID, validity expiration window, spend allowance limit, and whitelisted endpoint paths.
- **Permissions Granted:** Explicit, granular capability scopes (e.g. `github:read_code`, `github:merge_staging`, `cloud:deploy_staging`, `api:purchase_credits`). Unlisted actions default to **DENIED**.
- **Cryptographic Proof:** Signed using asymmetric cryptography (Ed25519) ensuring any attempt to alter claims (e.g. inflating budget from $150 to $10,000) invalidates the signature.

### 6. Access Control & Revocation Rules
- **Access Controller:** The human user or organization that issued the passport retains 100% sovereign authority over the agent's identity.
- **Instant Emergency Revocation:** One-click kill-switch webhook nullifies agent credentials globally across all connected microservices instantly.
- **Time-Based Expiration (TTL):** Passports naturally expire within short windows (e.g., 60 minutes), requiring fresh re-delegation.

### 7. Risks, Misuse Concerns & Privacy Mitigations
- **Risk — Prompt Injection / Agent Hallucination:** An attacker tricks the agent into issuing a `deploy_production` command. *Mitigation:* The AI Passport guard blocks execution at the network boundary because `cloud:deploy_production` was not signed in the passport scope array.
- **Risk — Replay Attacks:** Interception of a valid token. *Mitigation:* Short TTLs (60 mins), audience binding (`aud`), and nonces prevent replay on unapproved endpoints.
- **Privacy Protection:** Target APIs only receive the agent ID and scope proof—they never receive or store raw master human user credentials.

---

## ✨ Features & Architecture

```
agent-passport/
├── index.html          # Single-page long-scroll landing page & interactive sandbox
├── server.js           # Static HTTP server script
├── css/
│   └── style.css       # Egoist Machines minimalist theme & matte hardware card styling
└── js/
    ├── app.js          # Main application orchestrator & event bindings
    ├── passport.js     # AIPassport cryptographic class & JWT claim generator
    ├── mockServices.js # Target Service Guard (GitHub, AWS, Stripe) verification logic
    ├── agentRunner.js  # Step-by-step agent task execution simulator
    └── devpostContent.js# Structured submission document data
```

---

## 🛠️ How to Run Locally

```bash
# Clone repository
git clone https://github.com/RaghavParasher/agent-passport.git
cd agent-passport

# Start local server
node server.js
```
Then open `http://localhost:8080` in your browser.
