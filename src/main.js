import './styles/base.css';
import './styles/variables.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/pages.css';

import { initRouter } from './router.js';
import { initWallet } from './wallet.js';
import { renderSidebar } from './components/sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  // Basic App Shell
  app.innerHTML = `
    <nav class="sidebar" id="sidebar"></nav>
    <main class="main-content" id="main-content">
      <div class="page-container" id="page-view">
        <!-- Page content will be injected here -->
      </div>
    </main>
    <div id="modal-container"></div>
    <div id="toast-container" style="position: fixed; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 8px;"></div>
  `;

  renderSidebar(document.getElementById('sidebar'));
  
  initWallet();
  initRouter();
});
