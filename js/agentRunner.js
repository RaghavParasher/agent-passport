/**
 * AgentRunner.js - Autonomous Agent Simulator
 */

class AgentRunner {
  constructor(passport, serviceGuard, logCallback, uiUpdateCallback) {
    this.passport = passport;
    this.serviceGuard = serviceGuard;
    this.logCallback = logCallback;
    this.uiUpdateCallback = uiUpdateCallback;
    this.isExecuting = false;
  }

  setPassport(newPassport) {
    this.passport = newPassport;
  }

  async runScenario(scenarioKey) {
    if (this.isExecuting) return;
    this.isExecuting = true;

    this.logCallback(`Received instruction for scenario: [${scenarioKey}]`, 'info');

    if (scenarioKey === 'task-staging-deploy') {
      await this.stepReadCode();
      await this.stepMergeStaging();
      await this.stepDeployStaging();
    } else if (scenarioKey === 'task-buy-credits') {
      await this.stepBuyCredits(45.00);
    } else if (scenarioKey === 'task-prod-deploy') {
      await this.stepDeployProduction();
    } else if (scenarioKey === 'task-overspend') {
      await this.stepBuyCredits(500.00);
    }

    this.isExecuting = false;
  }

  async runCustomInstruction(instructionText) {
    if (this.isExecuting) return;
    this.isExecuting = true;

    this.logCallback(`Analyzing custom prompt: "${instructionText}"...`, 'info');
    await new Promise(r => setTimeout(r, 600));

    const lower = instructionText.toLowerCase();
    if (lower.includes('prod') || lower.includes('production')) {
      await this.stepDeployProduction();
    } else if (lower.includes('buy') || lower.includes('credit') || lower.includes('purchase')) {
      await this.stepBuyCredits(80.00);
    } else {
      await this.stepReadCode();
      await this.stepMergeStaging();
      await this.stepDeployStaging();
    }

    this.isExecuting = false;
  }

  async stepReadCode() {
    this.logCallback('Agent presenting Passport to GitHub API (github:read_code)...', 'info');
    await new Promise(r => setTimeout(r, 500));
    
    const result = this.serviceGuard.verifyAndExecute(this.passport, {
      targetApi: 'GitHub REST API /repos/acme/app',
      requiredScope: 'github:read_code',
      cost: 0,
      actionName: 'Read source files & PR'
    });

    if (result.success) {
      this.logCallback('✅ GitHub: Code read granted. Downloaded 4 files.', 'success');
    } else {
      this.logCallback(`❌ GitHub: ${result.entry.reason}`, 'denied');
    }
    this.uiUpdateCallback();
  }

  async stepMergeStaging() {
    this.logCallback('Agent presenting Passport to GitHub API (github:merge_staging)...', 'info');
    await new Promise(r => setTimeout(r, 600));

    const result = this.serviceGuard.verifyAndExecute(this.passport, {
      targetApi: 'GitHub REST API /repos/acme/app/merges',
      requiredScope: 'github:merge_staging',
      cost: 0,
      actionName: 'Merge feature branch to staging'
    });

    if (result.success) {
      this.logCallback('✅ GitHub: Merged PR #142 into staging branch.', 'success');
    } else {
      this.logCallback(`❌ GitHub: ${result.entry.reason}`, 'denied');
    }
    this.uiUpdateCallback();
  }

  async stepDeployStaging() {
    this.logCallback('Agent presenting Passport to AWS Cloud Console (cloud:deploy_staging)...', 'info');
    await new Promise(r => setTimeout(r, 700));

    const result = this.serviceGuard.verifyAndExecute(this.passport, {
      targetApi: 'AWS ECS /deployments/staging-cluster',
      requiredScope: 'cloud:deploy_staging',
      cost: 0,
      actionName: 'Trigger Staging Build & Rollout'
    });

    if (result.success) {
      this.logCallback('🚀 Cloud Service: Staging container deployed successfully (v4.2.1-stage).', 'success');
    } else {
      this.logCallback(`❌ Cloud Service: ${result.entry.reason}`, 'denied');
    }
    this.uiUpdateCallback();
  }

  async stepDeployProduction() {
    this.logCallback('Agent presenting Passport to AWS Cloud Console (cloud:deploy_production)...', 'info');
    await new Promise(r => setTimeout(r, 700));

    const result = this.serviceGuard.verifyAndExecute(this.passport, {
      targetApi: 'AWS ECS /deployments/prod-cluster-us-east',
      requiredScope: 'cloud:deploy_production',
      cost: 0,
      actionName: 'Trigger Production Deployment'
    });

    if (result.success) {
      this.logCallback('🚀 Cloud Service: Production deploy executed!', 'success');
    } else {
      this.logCallback(`🛑 SECURITY BLOCK: AWS Guard rejected deployment! Reason: ${result.entry.reason}`, 'denied');
    }
    this.uiUpdateCallback();
  }

  async stepBuyCredits(amount) {
    this.logCallback(`Agent requesting purchase of $${amount.toFixed(2)} compute credits (api:purchase_credits)...`, 'info');
    await new Promise(r => setTimeout(r, 700));

    const result = this.serviceGuard.verifyAndExecute(this.passport, {
      targetApi: 'Stripe Billing API /v1/charges',
      requiredScope: 'api:purchase_credits',
      cost: amount,
      actionName: 'Purchase API Compute Credits'
    });

    if (result.success) {
      this.logCallback(`💳 Stripe API: Payment of $${amount.toFixed(2)} processed. Remaining Passport Budget: $${this.passport.remainingBudget.toFixed(2)}`, 'success');
    } else {
      this.logCallback(`🛑 BILLING BLOCK: Stripe API declined transaction! Reason: ${result.entry.reason}`, 'denied');
    }
    this.uiUpdateCallback();
  }
}
