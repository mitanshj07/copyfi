import { ethers } from 'ethers';

export let walletState = {
  isConnected: false,
  address: null,
  isSmartAccount: false,
  balance: '0.00',
  tier: 'Free'
};

const listeners = [];

export function subscribe(callback) {
  listeners.push(callback);
}

function notify() {
  listeners.forEach(cb => cb(walletState));
  renderWalletUI();
}

export async function initWallet() {
  // Check if previously connected in localStorage (simulated)
  const saved = localStorage.getItem('copyfi_wallet');
  if (saved) {
    walletState = JSON.parse(saved);
    notify();
  }
}

export async function connectWallet() {
  // Simulate wallet connection and Smart Account (ERC-4337) upgrade check
  return new Promise((resolve) => {
    // Simulate latency
    setTimeout(() => {
      // Generate a random mock address
      const randomAddr = ethers.Wallet.createRandom().address;
      
      walletState = {
        isConnected: true,
        address: randomAddr,
        isSmartAccount: true, // Simulating EIP-7702 or native ERC-4337
        balance: '4.20',
        tier: 'Pro'
      };
      
      localStorage.setItem('copyfi_wallet', JSON.stringify(walletState));
      notify();
      resolve(walletState);
    }, 1000);
  });
}

export function disconnectWallet() {
  walletState = {
    isConnected: false,
    address: null,
    isSmartAccount: false,
    balance: '0.00',
    tier: 'Free'
  };
  localStorage.removeItem('copyfi_wallet');
  notify();
}

// Utility to shorten address
export function shortenAddress(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// Re-renders any UI element with id 'wallet-status-container'
export function renderWalletUI() {
  const container = document.getElementById('wallet-status-container');
  if (!container) return;

  if (walletState.isConnected) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div class="badge ${walletState.isSmartAccount ? 'success' : 'warning'}">
            ${walletState.isSmartAccount ? 'Smart Account' : 'EOA'}
          </div>
          <span style="font-size: 0.875rem; color: var(--color-text-secondary);">${walletState.balance} ETH</span>
        </div>
        <button id="btn-disconnect" class="btn btn-secondary" style="width: 100%; justify-content: space-between;">
          <span>${shortenAddress(walletState.address)}</span>
          <span style="font-size: 0.75rem; opacity: 0.7;">Disconnect</span>
        </button>
      </div>
    `;
    
    document.getElementById('btn-disconnect').addEventListener('click', disconnectWallet);
  } else {
    container.innerHTML = `
      <button id="btn-connect" class="btn btn-primary" style="width: 100%;">
        Connect Wallet
      </button>
      <div style="text-align: center; margin-top: 8px; font-size: 0.75rem; color: var(--color-text-muted);">
        Supports EIP-7702 & ERC-4337
      </div>
    `;
    
    document.getElementById('btn-connect').addEventListener('click', async (e) => {
      const btn = e.target;
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Connecting...';
      btn.disabled = true;
      await connectWallet();
    });
  }
}

export function updateWalletTier(newTier) {
  if (!walletState.isConnected) return;
  walletState.tier = newTier;
  localStorage.setItem('copyfi_wallet', JSON.stringify(walletState));
  notify();
}

export function deductWalletBalance(amount) {
  if (!walletState.isConnected) return false;
  const balanceNum = parseFloat(walletState.balance);
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0 || amountNum > balanceNum) return false;
  walletState.balance = (balanceNum - amountNum).toFixed(2);
  localStorage.setItem('copyfi_wallet', JSON.stringify(walletState));
  notify();
  return true;
}

export function addWalletBalance(amount) {
  const num = parseFloat(amount);
  if (!walletState.isConnected || isNaN(num) || num <= 0) return false;
  walletState.balance = (parseFloat(walletState.balance) + num).toFixed(2);
  localStorage.setItem('copyfi_wallet', JSON.stringify(walletState));
  notify();
  return true;
}

