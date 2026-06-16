import { renderWalletUI } from '../wallet.js';

export function renderSidebar(container) {
  container.innerHTML = `
    <div class="sidebar-logo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
        <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      CopyFi
    </div>
    
    <div class="nav-menu">
      <a href="#/" class="nav-item">
        <span>📊</span> Dashboard
      </a>
      <a href="#/explore" class="nav-item">
        <span>🔍</span> Explore Traders
      </a>
      <a href="#/portfolio" class="nav-item">
        <span>💼</span> My Portfolio
      </a>
      <a href="#/settings" class="nav-item">
        <span>⚙️</span> Settings & Tier
      </a>
    </div>

    <div class="sidebar-footer">
      <div id="wallet-status-container"></div>
    </div>
  `;
  
  // Need to render wallet UI initially
  setTimeout(renderWalletUI, 0);
}
