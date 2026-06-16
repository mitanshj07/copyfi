export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'var(--color-success)' : 
                  type === 'error' ? 'var(--color-danger)' : 
                  'var(--color-primary)';
                  
  toast.style.cssText = `
    background: var(--color-bg-elevated);
    border: var(--border-subtle);
    border-left: 4px solid ${bgColor};
    color: var(--color-text-primary);
    padding: 16px 24px;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-glass);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
  `;

  // Icon based on type
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  toast.innerHTML = `
    <span style="font-size: 1.25rem;">${icon}</span>
    <span style="font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  // Add keyframe animation if not exists
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}
