/**
 * Passport.js - Cryptographic AI Passport Model & Generator
 */

class AIPassport {
  constructor(config = {}) {
    this.id = config.id || `pass_${Math.random().toString(36).substring(2, 8)}`;
    this.subjectAgent = config.subjectAgent || 'DevOps-AutoDeployer-v4';
    this.issuer = config.issuer || 'alice@acme-corp.com';
    this.maxBudget = parseFloat(config.maxBudget) || 150.00;
    this.remainingBudget = parseFloat(config.remainingBudget ?? this.maxBudget);
    this.validityMinutes = parseInt(config.validityMinutes) || 60;
    this.scopes = config.scopes || ['github:read_code', 'github:merge_staging', 'cloud:deploy_staging', 'api:purchase_credits'];
    
    this.issuedAt = config.issuedAt || new Date().toISOString();
    this.expiresAt = config.expiresAt || new Date(Date.now() + this.validityMinutes * 60000).toISOString();
    
    this.isRevoked = config.isRevoked || false;

    // Simulated Ed25519 Cryptographic Signature
    this.signature = config.signature || this.generateSignature();
  }

  generateSignature() {
    const raw = `${this.id}:${this.subjectAgent}:${this.issuer}:${this.maxBudget}:${this.scopes.join(',')}:${this.issuedAt}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `0x8aef${hex}c9f120e83b409a1e${hex}bd41f90b`;
  }

  isExpired() {
    return new Date() > new Date(this.expiresAt);
  }

  isValid() {
    return !this.isRevoked && !this.isExpired();
  }

  hasScope(scope) {
    return this.scopes.includes(scope);
  }

  canAfford(amount) {
    return this.remainingBudget >= amount;
  }

  deductBudget(amount) {
    if (this.canAfford(amount)) {
      this.remainingBudget -= amount;
      return true;
    }
    return false;
  }

  revoke() {
    this.isRevoked = true;
  }

  unrevoke() {
    this.isRevoked = false;
  }

  toJSON() {
    return {
      header: {
        alg: "Ed25519",
        typ: "AI-PASSPORT-V1"
      },
      payload: {
        passport_id: this.id,
        iss: this.issuer,
        sub_agent: this.subjectAgent,
        iat: this.issuedAt,
        exp: this.expiresAt,
        status: this.isRevoked ? "REVOKED" : (this.isExpired() ? "EXPIRED" : "VALID"),
        delegation_constraints: {
          max_budget_usd: this.maxBudget,
          remaining_budget_usd: this.remainingBudget,
          allowed_scopes: this.scopes,
          revocation_check_url: "https://revocation.egoistmachines.org/check"
        }
      },
      signature: this.signature
    };
  }
}
