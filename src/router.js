// Simple SPA Router
import { renderDashboard } from './pages/dashboard.js';
import { renderExplore } from './pages/explore.js';
import { renderTrader } from './pages/trader.js';
import { renderVault } from './pages/vault.js';
import { renderPortfolio } from './pages/portfolio.js';
import { renderSettings } from './pages/settings.js';

const routes = {
  '/': renderDashboard,
  '/explore': renderExplore,
  '/portfolio': renderPortfolio,
  '/settings': renderSettings
};

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // initial load
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1); // remove '#'
  
  const pageView = document.getElementById('page-view');
  if (!pageView) return;

  // Clear current content
  pageView.innerHTML = '';
  
  // Trigger transition animation
  pageView.style.animation = 'none';
  pageView.offsetHeight; /* trigger reflow */
  pageView.style.animation = null;

  // Route matching logic
  if (path.startsWith('/trader/')) {
    const id = path.split('/')[2];
    renderTrader(pageView, id);
    updateActiveNav('/explore');
  } else if (path.startsWith('/vault/')) {
    const id = path.split('/')[2];
    renderVault(pageView, id);
    updateActiveNav('/portfolio');
  } else if (routes[path]) {
    routes[path](pageView);
    updateActiveNav(path);
  } else {
    // 404 fallback
    pageView.innerHTML = '<h1>404 - Page Not Found</h1>';
  }
}

function updateActiveNav(currentPath) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
    if (el.getAttribute('href') === '#' + currentPath) {
      el.classList.add('active');
    }
  });
}
