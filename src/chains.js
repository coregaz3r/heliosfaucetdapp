// src/chains.js
export const heliosTestnet = {
  id: 42000, // Chain ID untuk Helios Testnet
  name: 'Helios Testnet',
  network: 'helios',
  nativeCurrency: {
    decimals: 18,
    name: 'Helios',
    symbol: 'HLS',
  },
  rpcUrls: {
    public: { http: ['https://testnet1.helioschainlabs.org'] }, // RPC URL Publik
    default: { http: ['https://testnet1.helioschainlabs.org'] },
  },
  blockExplorers: {
    default: { name: 'HeliosScan', url: 'https://explorer.helioschainlabs.org/' },
  },
  testnet: true,
};