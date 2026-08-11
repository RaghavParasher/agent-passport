/**
 * App.js - Application Orchestrator & UI Binding
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let currentPassport = new AIPassport({
    subjectAgent: 'DevOps-AutoDeployer-v4',
    issuer: 'alice@acme-corp.com',
    maxBudget: 150.00,
    validityMinutes: 60,
    scopes: ['github:read_code', 'github:merge_staging', 'cloud:deploy_staging', 'api:purchase_credits']
  });

  const serviceGuard = new TargetServiceGuard();
  
  // UI Log stream function
  const appendLog = (msg, type = 'info') => {
    const stream = document.getElementById('log-stream');
    if (!stream) return;

    const timeStr = new Date().toLocaleTimeString();
    const div = document.createElement('div');
    div.className = `log-entry log-${type}`;
    div.innerHTML = `
      <span class="log-time">[${timeStr}]</span>
      <span class="log-msg">${msg}</span>
    `;
    stream.appendChild(div);
    stream.scrollTop = stream.scrollHeight;
  };

  // UI Refresh Handler
  const refreshUI = () => {
    // 1. Passport Card Preview
    document.getElementById('pv-id').textContent = `ID: ${currentPassport.id}`;
    document.getElementById('pv-agent-name').textContent = currentPassport.subjectAgent;
    document.getElementById('pv-issuer').textContent = currentPassport.issuer;
    document.getElementById('pv-budget').textContent = `$${currentPassport.remainingBudget.toFixed(2)} / $${currentPassport.maxBudget.toFixed(2)} USD`;
    document.getElementById('pv-sig').textContent = currentPassport.signature;

    const statusBadge = document.getElementById('passport-status-badge');
    const visualCard = document.getElementById('passport-visual-card');
    const inspectorStatus = document.getElementById('inspector-status-val');

    if (currentPassport.isRevoked) {
      statusBadge.textContent = 'REVOKED';
      statusBadge.style.background = '#ef4444';
      visualCard.classList.add('revoked');
      if (inspectorStatus) {
        inspectorStatus.textContent = 'REVOKED (KILL-SWITCH ACTIVE)';
        inspectorStatus.className = 'status-value red';
      }
    } else {
      statusBadge.textContent = 'ISSUED & VALID';
      statusBadge.style.background = '#10b981';
      visualCard.classList.remove('revoked');
      if (inspectorStatus) {
        inspectorStatus.textContent = 'ACTIVE & VALID';
        inspectorStatus.className = 'status-value green';
      }
    }

    // Scopes tags
    const tagsBox = document.getElementById('pv-scopes-tags');
    tagsBox.innerHTML = currentPassport.scopes.map(s => `<span class="tag">${s}</span>`).join('');

    // JSON preview
    document.getElementById('passport-json-display').textContent = JSON.stringify(currentPassport.toJSON(), null, 2);

    // Sandbox Profile Bar
    document.getElementById('sandbox-agent-name').textContent = `Agent: ${currentPassport.subjectAgent}`;
    document.getElementById('sandbox-passport-id').textContent = `Passport: ${currentPassport.id}`;
    document.getElementById('sandbox-remaining-budget').textContent = `$${currentPassport.remainingBudget.toFixed(2)} / $${currentPassport.maxBudget.toFixed(2)}`;

    // Audit Table
    const auditBody = document.getElementById('audit-table-body');
    const logs = serviceGuard.getAuditLedger();

    if (logs.length === 0) {
      auditBody.innerHTML = `<tr><td colspan="6" class="text-muted center">No authorization checks recorded yet. Run tasks in the Agent Sandbox.</td></tr>`;
    } else {
      auditBody.innerHTML = logs.map(l => `
        <tr>
          <td>${l.timestamp}</td>
          <td><code>${l.targetApi}</code></td>
          <td><code>${l.requiredScope}</code></td>
          <td>$${l.cost.toFixed(2)}</td>
          <td><span class="${l.decision === 'GRANTED' ? 'badge-pass' : 'badge-fail'}">${l.decision}</span></td>
          <td>${l.reason}</td>
        </tr>
      `).join('');
    }
  };

  // Instantiate Agent Runner
  const runner = new AgentRunner(currentPassport, serviceGuard, appendLog, refreshUI);

  // Tab Navigation
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      navButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Form Submit: Issue Passport
  const passportForm = document.getElementById('passport-form');
  passportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const agentName = document.getElementById('agent-name').value;
    const maxBudget = parseFloat(document.getElementById('max-budget').value);
    const validityMins = parseInt(document.getElementById('validity-mins').value);
    
    const checkedScopes = Array.from(document.querySelectorAll('input[name="scopes"]:checked')).map(cb => cb.value);

    currentPassport = new AIPassport({
      subjectAgent: agentName,
      maxBudget: maxBudget,
      validityMinutes: validityMins,
      scopes: checkedScopes
    });

    runner.setPassport(currentPassport);
    refreshUI();

    appendLog(`New AI Passport [${currentPassport.id}] generated & signed for ${agentName}.`, 'success');
    alert(`AI Passport [${currentPassport.id}] issued successfully! Proceed to Tab 2 (Agent Sandbox) to simulate tasks.`);
  });

  // Scenario Buttons
  const scenarioBtns = document.querySelectorAll('.btn-scenario');
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const taskKey = btn.getAttribute('data-task');
      runner.runScenario(taskKey);
    });
  });

  // Custom Prompt Runner
  document.getElementById('btn-run-custom').addEventListener('click', () => {
    const input = document.getElementById('custom-instruction');
    const val = input.value.trim();
    if (val) {
      runner.runCustomInstruction(val);
      input.value = '';
    }
  });

  // Clear Logs
  document.getElementById('btn-clear-logs').addEventListener('click', () => {
    document.getElementById('log-stream').innerHTML = '';
    appendLog('Stream cleared.', 'info');
  });

  // Toggle Revocation
  const toggleRevokeBtn = document.getElementById('btn-toggle-revoke');
  toggleRevokeBtn.addEventListener('click', () => {
    if (currentPassport.isRevoked) {
      currentPassport.unrevoke();
      appendLog(`Passport ${currentPassport.id} RESTORED to VALID status.`, 'success');
      toggleRevokeBtn.textContent = '🛑 INSTANTLY REVOKE AI PASSPORT';
      toggleRevokeBtn.className = 'btn btn-danger btn-block btn-large';
    } else {
      currentPassport.revoke();
      appendLog(`🛑 EMERGENCY KILL-SWITCH: Passport ${currentPassport.id} REVOKED!`, 'denied');
      toggleRevokeBtn.textContent = '🔄 UN-REVOKE PASSPORT';
      toggleRevokeBtn.className = 'btn btn-secondary btn-block btn-large';
    }
    refreshUI();
  });

  // Copy JSON Token
  document.getElementById('btn-copy-token').addEventListener('click', () => {
    const text = JSON.stringify(currentPassport.toJSON(), null, 2);
    navigator.clipboard.writeText(text);
    alert('AI Passport Token Claims copied to clipboard!');
  });

  // Devpost Submission Renderer
  const devpostContainer = document.getElementById('devpost-rendered-content');
  if (devpostContainer && typeof DEVPOST_SUBMISSION_DATA !== 'undefined') {
    devpostContainer.innerHTML = DEVPOST_SUBMISSION_DATA.map(sec => `
      <div class="dp-section">
        <h3><span>${sec.icon}</span> ${sec.title}</h3>
        <div>${sec.content}</div>
      </div>
    `).join('');
  }

  // Copy Devpost Text Button
  document.getElementById('btn-copy-devpost').addEventListener('click', () => {
    let fullText = "=== DEVPOST SUBMISSION WRITEUP: AGENT-PASSPORT ===\n\n";
    DEVPOST_SUBMISSION_DATA.forEach(sec => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sec.content;
      fullText += `${sec.icon} ${sec.title}\n${tempDiv.innerText}\n\n-----------------------------------\n\n`;
    });
    navigator.clipboard.writeText(fullText);
    alert('Full Devpost Submission Document copied to clipboard!');
  });

  // Initial UI Render
  refreshUI();
});
