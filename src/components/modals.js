import { showToast } from './toast.js';
import { walletState } from '../wallet.js';

export function showCopyModal(trader) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const modalHtml = `
    <dialog id="copy-modal" class="glass-card" style="padding: 0; margin: auto; max-width: 500px; width: 100%; border: var(--border-subtle); background: var(--color-bg-base); color: var(--color-text-primary);">
      <div style="padding: 24px; border-bottom: var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0;">Copy ${trader.name}</h3>
        <button id="close-modal-btn" style="color: var(--color-text-secondary); font-size: 1.5rem; background: none; border: none; cursor: pointer;">&times;</button>
      </div>
      
      <div style="padding: 24px;">
        <div style="display: flex; gap: 16px; margin-bottom: 24px; padding: 16px; background: var(--color-bg-surface); border-radius: var(--radius-sm);">
          <img src="${trader.avatar}" class="avatar sm" />
          <div>
            <div style="font-weight: 600;">${trader.strategy} Strategy</div>
            <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Risk Score: ${trader.riskScore}/10</div>
          </div>
        </div>

        <div class="input-group">
          <label>Amount to Copy (ETH)</label>
          <div style="display: flex; gap: 8px;">
            <input type="number" id="copy-amount" class="input-field" style="flex: 1;" placeholder="0.0" step="0.1" min="0.1">
            <button class="btn btn-secondary" onclick="document.getElementById('copy-amount').value='${walletState.balance}'">Max</button>
          </div>
          <div style="font-size: 0.75rem; color: var(--color-text-muted); text-align: right;">Balance: ${walletState.balance} ETH</div>
        </div>

        <div style="margin: 24px 0; padding: 16px; border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.875rem;">
            <span style="color: var(--color-text-secondary);">Performance Fee</span>
            <span>20% of Profits</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.875rem;">
            <span style="color: var(--color-text-secondary);">Gas Fee</span>
            <span class="value-positive">Sponsored (Paymaster)</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
            <span style="color: var(--color-text-secondary);">Smart Session Auth</span>
            <span>Required</span>
          </div>
        </div>

        <button id="confirm-copy-btn" class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 1.1rem;">
          Authorize Session & Copy
        </button>
      </div>
    </dialog>
  `;

  container.innerHTML = modalHtml;
  const dialog = document.getElementById('copy-modal');
  
  // Show modal
  dialog.showModal();
  
  // Custom backdrop styling
  dialog.style.backdropFilter = 'blur(8px)';
  dialog.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    dialog.close();
    container.innerHTML = '';
  });

  document.getElementById('confirm-copy-btn').addEventListener('click', () => {
    if (!walletState.isConnected) {
      showToast('Please connect wallet first', 'error');
      return;
    }
    
    const amount = document.getElementById('copy-amount').value;
    if (!amount || amount <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }

    const btn = document.getElementById('confirm-copy-btn');
    btn.innerHTML = 'Signing Session Key...';
    btn.disabled = true;

    // Simulate smart contract interaction (ERC-4337 Session Key signing)
    setTimeout(() => {
      dialog.close();
      container.innerHTML = '';
      showToast(`Successfully copied ${trader.name} with ${amount} ETH!`, 'success');
      // In a real app, we would update global state here and navigate to portfolio
      setTimeout(() => {
        window.location.hash = '#/portfolio';
      }, 1500);
    }, 1500);
  });
}
