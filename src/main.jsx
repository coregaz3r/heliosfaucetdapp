// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Impor yang dibutuhkan
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 👈 1. IMPORT INI
import { heliosTestnet } from './chains';

// 2. BUAT INSTANCE DARI QUERY CLIENT
const queryClient = new QueryClient();

const { connectors } = getDefaultWallets({
  appName: 'Helios Faucet',
  projectId: 'fd7ef0f98c0f930558a19a6dd82437ba', // JANGAN LUPA GANTI
});

const config = createConfig({
  chains: [heliosTestnet],
  connectors,
  transports: {
    [heliosTestnet.id]: http(),
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. BUNGKUS SEMUANYA DENGAN QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);