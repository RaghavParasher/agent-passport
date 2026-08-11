/**
 * DevpostContent.js - Structured Devpost Submission Text addressing all criteria
 */

const DEVPOST_SUBMISSION_DATA = [
  {
    title: "1. Team Name & Track / Lane Selection",
    icon: "📌",
    content: `
      <p><strong>Team Name:</strong> Aegis AI / Egoist Protocol</p>
      <p><strong>Track:</strong> Agents Track</p>
      <p><strong>Lane:</strong> Build Lane (Interactive Working Demo & Visualizer + Cryptographic Protocol Specification)</p>
      <p><strong>Core Submission Question Answered:</strong> <em>Where can AI Passport be used best?</em> — AI Passport is most urgently needed in <strong>Autonomous AI Agent Delegation</strong>, where humans must grant AI agents high-privilege tool execution capabilities without exposing master API keys, risking runaway financial costs, or losing instant emergency control.`
    `
  },
  {
    title: "2. Short Summary & Concept Overview",
    icon: "💡",
    content: `
      <p><strong>Agent-Passport</strong> is a zero-trust bearer credential and authorization specification for autonomous AI agents. Just as human passports allow citizens to cross international borders under sovereign governance, an <strong>AI Passport</strong> allows autonomous software agents to navigate enterprise APIs, cloud consoles, and financial services under strict, cryptographically enforced human delegation.</p>
      <p>It packages time-bound claims, granular capability scopes (e.g. <code>github:merge_staging</code>), monetary spending caps (e.g. <code>max_budget: $150</code>), and real-time revocation verification into an Ed25519-signed token presented with every API payload.</p>
    `
  },
  {
    title: "3. The Problem You Are Solving",
    icon: "🔥",
    content: `
      <p>Autonomous AI agents are transitioning from conversational chat systems to active executing entities that perform code commits, manage cloud infrastructure, make purchases, and interact with third-party software APIs.</p>
      <ul>
        <li><strong>Over-Privileged Master Keys:</strong> Developers currently provision agents with static API keys or admin OAuth tokens. If an agent hallucinates, loops, or is prompt-injected, it can destroy production resources or drain bank accounts.</li>
        <li><strong>Lack of Real-Time Revocation:</strong> Revoking access currently requires resetting the human user's primary API key, disrupting whole systems.</li>
        <li><strong>Non-Repudiation Gap:</strong> Audit logs cannot distinguish between human actions and autonomous agent actions taking place under shared API keys.</li>
      </ul>
    `
  },
  {
    title: "4. The User or Group Affected",
    icon: "👥",
    content: `
      <p><strong>Primary Users:</strong> Enterprise Software Developers, DevOps Engineers, AI Agent Builders, Finance Managers, and End-Users delegating tasks to autonomous bots (e.g., procurement agents, coding assistants, automated customer support agents).</p>
      <p><strong>Secondary Users:</strong> API Service Providers (GitHub, AWS, Stripe, Twilio) who require verifiable proof that an incoming automated request originates from a authorized, spend-constrained AI agent rather than a malicious bot or compromised key.</p>
    `
  },
  {
    title: "5. How AI Passport is Used in Practice",
    icon: "⚙️",
    content: `
      <ol>
        <li><strong>Issuance:</strong> A human user or enterprise identity server issues a signed AI Passport token bound to a specific agent instance (e.g., <code>DevOps-AutoDeployer-v4</code>).</li>
        <li><strong>Presentation:</strong> When the agent makes HTTP calls to target services (e.g., GitHub API or AWS ECS), it attaches the passport in the <code>X-AI-Passport</code> authorization header.</li>
        <li><strong>Verification:</strong> Target service API gateways inspect the passport signature, check requested scopes against granted claims, enforce financial caps, and verify revocation status via lightweight webhook/lookup before allowing execution.</li>
      </ol>
    `
  },
  {
    title: "6. Context, Permission, Proof, and Access Controls",
    icon: "🔐",
    content: `
      <ul>
        <li><strong>Context Carried:</strong> Agent version, human owner ID, session task ID, max financial budget cap, remaining allowance, allowed API endpoints.</li>
        <li><strong>Permissions Granted:</strong> Scoped, explicit permission strings (e.g., <code>github:read_code</code>, <code>cloud:deploy_staging</code>). Unlisted permissions default to <strong>DENIED</strong>.</li>
        <li><strong>Cryptographic Proof:</strong> Signed using asymmetric cryptography (Ed25519) ensuring tampering with claims (e.g., inflating budget from $150 to $10,000) immediately invalidates the signature.</li>
        <li><strong>Access Control:</strong> Zero-trust policy enforced at target service API perimeter.</li>
      </ul>
    `
  },
  {
    title: "7. Who Controls Access & Revocation Rules",
    icon: "🛡️",
    content: `
      <p><strong>Access Controller:</strong> The human user or organization that issued the passport retains 100% sovereign authority.</p>
      <p><strong>Revocation Mechanisms:</strong></p>
      <ul>
        <li><strong>Instant Emergency Kill-Switch:</strong> One-click UI or API webhook flips global revocation state, causing all downstream microservices to immediately decline subsequent agent requests.</li>
        <li><strong>Time-Based Expiration (TTL):</strong> Passports naturally expire within short windows (e.g. 60 minutes) requiring fresh re-delegation.</li>
        <li><strong>Budget Exhaustion:</strong> Automatic lockout once the dollar allowance reaches $0.00.</li>
      </ul>
    `
  },
  {
    title: "8. Risks, Misuse Concerns & Privacy Mitigations",
    icon: "⚠️",
    content: `
      <ul>
        <li><strong>Risk — Prompt Injection / Agent Hallucination:</strong> An attacker tricks the agent into issuing a <code>deploy_production</code> command. <em>Mitigation:</em> The AI Passport guard blocks the execution at the network boundary because <code>cloud:deploy_production</code> was not signed in the scope array.</li>
        <li><strong>Risk — Replay Attacks:</strong> A malicious actor intercepts a valid passport token. <em>Mitigation:</em> Short TTLs, target audience binding (<code>aud</code> claim), and nonces prevent replay on unapproved endpoints.</li>
        <li><strong>Privacy Protection:</strong> Downstream services only see the agent identity and scope proof—they never receive or store the human master credentials.</li>
      </ul>
    `
  }
];
