/* ==========================================================================
   SureBridge Insurance Brokerage - Claims & Application Trackers Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Claim Tracker Lookup Simulation
  const claimSearchForm = document.getElementById('claim-tracker-form');
  const claimStatusOutput = document.getElementById('claim-status-result');

  if (claimSearchForm && claimStatusOutput) {
    claimSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const claimId = document.getElementById('claim-id-input').value.trim();

      if (!claimId) {
        window.AureonUI?.notify?.('Enter a valid Claim ID (for example CLM-9842).','warning',{title:'Claim ID required'});
        return;
      }

      // Demo Output State Rendering
      claimStatusOutput.innerHTML = `
        <div class="alert alert-info border-0 shadow-sm mt-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="mb-0 text-primary"><i class="bi bi-shield-check me-2"></i> Claim #${claimId} Status: <span class="badge bg-warning text-dark">Under Review</span></h5>
            <span class="text-muted small">Updated: Today, 09:30 AM</span>
          </div>
          <p class="mb-3">Your claim submission for <strong>Medical Reimbursement - General Health</strong> is currently being evaluated by Northstar Life underwriting team.</p>
          <div class="progress mb-3" style="height: 10px;">
            <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: 50%;"></div>
          </div>
          <div class="d-flex justify-content-between small text-muted">
            <span>Submitted</span>
            <strong class="text-dark">Reviewing Docs</strong>
            <span>Insurer Assessment</span>
            <span>Payout</span>
          </div>
        </div>
      `;
    });
  }
});
