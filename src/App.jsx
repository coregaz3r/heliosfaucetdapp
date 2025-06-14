// src/App.jsx

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
// Impor rpcUrl dari file konfigurasi
import { contractAddress, contractABI, rpcUrl } from './contractConfig'; 
import './App.css';
import IconRain from './IconRain';

// Fungsi walletClientToSigner tidak berubah
export function walletClientToSigner(walletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  const signer = new ethers.JsonRpcSigner(provider, account.address);
  return signer;
}

function App() {
  // State yang sudah ada
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [signer, setSigner] = useState(null);
  const [txStatus, setTxStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [txHash, setTxHash] = useState('');

  // ▼▼▼ 1. TAMBAHKAN STATE BARU UNTUK SALDO FAUCET ▼▼▼
  const [faucetBalance, setFaucetBalance] = useState('');

  // ▼▼▼ 2. BUAT FUNGSI BARU UNTUK MENGAMBIL SALDO ▼▼▼
  const fetchFaucetBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const balance = await provider.getBalance(contractAddress);
      const formattedBalance = ethers.formatEther(balance);
      setFaucetBalance(formattedBalance);
    } catch (error) {
      console.error("Failed to fetch faucet balance:", error);
      setFaucetBalance('N/A');
    }
  };

  // ▼▼▼ 3. GUNAKAN useEffect UNTUK MEMANGGIL FUNGSI SECARA OTOMATIS ▼▼▼
  useEffect(() => {
    fetchFaucetBalance();
    const interval = setInterval(fetchFaucetBalance, 15000); // Refresh setiap 15 detik
    return () => clearInterval(interval); // Cleanup
  }, []);

  // useEffect untuk signer tidak berubah
  useEffect(() => {
    if (walletClient) {
      const ethersSigner = walletClientToSigner(walletClient);
      setSigner(ethersSigner);
    } else {
      setSigner(null);
    }
  }, [walletClient]);

  // handleClaim diperbarui untuk memanggil fetchFaucetBalance
  const handleClaim = async () => {
    if (!signer) {
      alert('Signer not found. Please ensure your wallet is connected properly.');
      return;
    }
    setIsLoading(true);
    setTxStatus('Sending transaction...');
    setTxHash('');

    try {
      const faucetContract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await faucetContract.claim();
      setTxHash(tx.hash);
      setTxStatus('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setTxStatus('Claim successful! 🎉');
      
      // ▼▼▼ 4. PANGGIL ULANG FUNGSI SALDO SETELAH KLAIM BERHASIL ▼▼▼
      fetchFaucetBalance(); 
    } catch (error) {
      console.error('Error claiming faucet:', error);
      const errorMessage = error.reason || error.message || "An unknown error occurred.";
      setTxStatus(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi handleCopyAddress tidak berubah
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // ▼▼▼ 5. PERBARUI RETURN DENGAN ELEMEN SALDO ▼▼▼
  return (
    <>
      <IconRain />
      <header className="header">
        <ConnectButton />
      </header>
      
      <div className="faucet-wrapper">
        <main className="faucet-card">
          <h1>Unofficial</h1>
          <h1>Helios Faucet</h1>
          <p>Drip 1 $HLS Every 24 hours</p>

          {/* Elemen baru untuk menampilkan saldo */}
          <div className="faucet-balance">
            {faucetBalance ? (
              <span>Available Balance: <strong>{parseFloat(faucetBalance).toFixed(4)} HLS</strong></span>
            ) : (
              <span>Loading balance...</span>
            )}
          </div>

          {isConnected ? (
            <div className="claim-section">
              <button 
                onClick={handleClaim} 
                disabled={isLoading || !signer} 
                className={`claim-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? <div className="spinner"></div> : <span className="button-text">Claim $HLS</span>}
              </button>
              
              {txStatus && (
                <p className={`status-message ${txStatus.startsWith('Error:') ? 'error' : ''}`}>{txStatus}</p>
              )}
              {txHash && (
                <div className="tx-link">
                  <a href={`https://explorer.helioschainlabs.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                    View Transaction on Explorer
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="status-message">Please connect your wallet to claim tokens.</p>
          )}

          <div className="card-footer">
            <a href="https://twitter.com/coregaz3r" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.602.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
              </svg>
              Built by @coregaz3r
            </a>
            <div className="return-section">
              <p>Done with the tokens? Send them back!</p>
              <div className="address-box">
                <span>{contractAddress}</span>
                <button onClick={handleCopyAddress} className="copy-button">
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;