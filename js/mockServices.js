/**
 * MockServices.js - Simulated Target APIs (GitHub, Cloud, Compute Billing)
 * Verifies AI Passport before allowing action execution.
 */

class TargetServiceGuard {
  constructor() {
    this.auditLogs = [];
  }

  verifyAndExecute(passport, actionDetails) {
    const { targetApi, requiredScope, cost = 0, actionName } = actionDetails;
    const timestamp = new Date().toLocaleTimeString();

    // 1. Revocation & Expiration Check
    if (passport.isRevoked) {
      const entry = {
        timestamp,
        targetApi,
        requiredScope,
        cost,
        decision: 'DENIED',
        reason: 'Passport has been REVOKED by human issuer'
      };
      this.auditLogs.unshift(entry);
      return { success: false, entry };
    }

    if (passport.isExpired()) {
      const entry = {
        timestamp,
        targetApi,
        requiredScope,
        cost,
        decision: 'DENIED',
        reason: 'Passport token EXPIRED'
      };
      this.auditLogs.unshift(entry);
      return { success: false, entry };
    }

    // 2. Scope Check
    if (!passport.hasScope(requiredScope)) {
      const entry = {
        timestamp,
        targetApi,
        requiredScope,
        cost,
        decision: 'DENIED',
        reason: `Missing required scope [${requiredScope}] in Passport`
      };
      this.auditLogs.unshift(entry);
      return { success: false, entry };
    }

    // 3. Financial Cap Check
    if (cost > 0) {
      if (!passport.canAfford(cost)) {
        const entry = {
          timestamp,
          targetApi,
          requiredScope,
          cost,
          decision: 'DENIED',
          reason: `Cost ($${cost.toFixed(2)}) exceeds remaining Passport budget ($${passport.remainingBudget.toFixed(2)})`
        };
        this.auditLogs.unshift(entry);
        return { success: false, entry };
      }

      // Deduct budget
      passport.deductBudget(cost);
    }

    // 4. Success
    const entry = {
      timestamp,
      targetApi,
      requiredScope,
      cost,
      decision: 'GRANTED',
      reason: `Authenticated & Authorized via Passport ${passport.id}`
    };
    this.auditLogs.unshift(entry);
    return { success: true, entry };
  }

  getAuditLedger() {
    return this.auditLogs;
  }

  clearLedger() {
    this.auditLogs = [];
  }
}
