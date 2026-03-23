import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, ShieldAlert, Zap, Send, Activity, Info } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:3001/api/analyze-transaction';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [provider, setProvider] = useState(null);
  
  // Transaction State
  const [txTo, setTxTo] = useState("");
  const [txValue, setTxValue] = useState("");
  const [txData, setTxData] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [riskProfile, setRiskProfile] = useState(null);
  const [txStatus, setTxStatus] = useState(null);

  useEffect(() => {
    // Check if wallet is connected on load
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          updateBalance(accounts[0], provider);
        } else {
          setAccount(null);
          setBalance("0");
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this dApp!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      if (provider) updateBalance(accounts[0], provider);
    } catch (error) {
      console.error("Connection failed", error);
    }
  };

  const updateBalance = async (address, provider) => {
    try {
      const bal = await provider.getBalance(address);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!txTo || !txValue) return;

    setIsSimulating(true);
    setRiskProfile(null);
    setTxStatus("Simulating transaction security...");

    try {
      const response = await axios.post(BACKEND_URL, {
        to: txTo,
        value: ethers.parseEther(txValue).toString(),
        data: txData || '0x',
        from: account
      });
      
      if (response.data.success) {
        setRiskProfile(response.data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Simulation failed. Make sure backend is running.");
    } finally {
      setIsSimulating(false);
      setTxStatus(null);
    }
  };

  const confirmTransaction = async () => {
    if (!provider || !account) return;
    try {
      const signer = await provider.getSigner();
      setTxStatus("Waiting for wallet confirmation...");
      
      const tx = await signer.sendTransaction({
        to: txTo,
        value: ethers.parseEther(txValue),
        data: txData || '0x'
      });
      
      setTxStatus(`Transaction Sent! Hash: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      setTxStatus("Transaction Confirmed!");
      updateBalance(account, provider);
      setRiskProfile(null); // Reset after success
      setTxTo("");
      setTxValue("");
      setTxData("");
    } catch (err) {
      console.error(err);
      setTxStatus("Transaction failed or was rejected.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-sans flex flex-col items-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--primary))] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--accent))] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>

      <header className="w-full max-w-5xl flex justify-between items-center mb-12 relative z-10 glass-panel px-6 py-4 rounded-3xl mt-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Shardeum Nexus
          </h1>
        </div>
        
        {!account ? (
          <button 
            onClick={connectWallet}
            className="btn-glow flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:opacity-90 transition-all px-6 py-2.5 rounded-full font-semibold text-white shadow-lg"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-sm shadow-inner">
              {Number(balance).toFixed(4)} SHM
            </div>
            <div className="px-4 py-2 bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30 rounded-full font-mono text-sm font-medium">
              {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Column: Send Transaction */}
        <div className="space-y-6">
          <section className="glass-panel p-8 rounded-3xl transition-all duration-300 hover:border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-[hsl(var(--primary))]" />
                Send Assets
              </h2>
            </div>
            
            <form onSubmit={handleSimulate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-foreground/70 ml-1">Recipient Address</label>
                <input 
                  type="text" 
                  value={txTo}
                  onChange={(e) => setTxTo(e.target.value)}
                  placeholder="0x..." 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 transition-all font-mono text-sm placeholder:text-white/20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-foreground/70 ml-1">Amount (SHM)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.0001"
                    value={txValue}
                    onChange={(e) => setTxValue(e.target.value)}
                    placeholder="0.0" 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 transition-all font-mono text-lg"
                    required
                  />
                  <span className="absolute right-4 top-4 text-white/40 font-semibold">SHM</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-foreground/70 ml-1 flex items-center justify-between">
                  Contract Data (Optional)
                  <Info className="w-4 h-4 text-white/40" />
                </label>
                <input 
                  type="text" 
                  value={txData}
                  onChange={(e) => setTxData(e.target.value)}
                  placeholder="0x..." 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 transition-all font-mono text-sm placeholder:text-white/20"
                />
              </div>

              <button 
                type="submit"
                disabled={!account || isSimulating || riskProfile !== null}
                className="w-full btn-glow flex justify-center items-center gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-6 py-4 rounded-2xl font-semibold text-white shadow-lg text-lg mt-4"
              >
                {!account ? "Connect Wallet to Send" : (isSimulating ? "Analyzing Risk..." : "Simulate & Analyze")}
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Risk Profiler & Insights */}
        <div className="space-y-6 flex flex-col">
          <section className="glass-panel p-8 rounded-3xl flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[hsl(var(--accent))]" />
                Security Risk Profiler
              </h2>
              {riskProfile && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${riskProfile.riskScore > 70 ? 'bg-red-500/20 text-red-400 border-red-500/30' : riskProfile.riskScore > 30 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                  SCORE: {riskProfile.riskScore}/100
                </div>
              )}
            </div>

            {!riskProfile && !isSimulating ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                <Activity className="w-16 h-16 mb-4" />
                <p>Fill out the transaction details and simulate<br/>to analyze security risks and optimize gas.</p>
              </div>
            ) : isSimulating ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-80">
                <div className="w-12 h-12 rounded-full border-4 border-[hsl(var(--primary))]/30 border-t-[hsl(var(--primary))] animate-spin mb-4"></div>
                <p className="animate-pulse">Processing Simulation & Threat Heuristics...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                
                {/* Score Banner */}
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${riskProfile.riskScore > 70 ? 'bg-red-500/10 border-red-500/30 text-red-200' : riskProfile.riskScore > 30 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200' : 'bg-green-500/10 border-green-500/30 text-green-200'}`}>
                  <ShieldAlert className={`w-8 h-8 ${riskProfile.riskScore > 70 ? 'text-red-400' : riskProfile.riskScore > 30 ? 'text-yellow-400' : 'text-green-400'}`} />
                  <div>
                    <h3 className="font-bold text-lg">{riskProfile.securityLevel}</h3>
                    <p className="text-sm opacity-80">{riskProfile.riskScore > 30 ? "Proceed with caution. Please review the warnings below." : "This transaction looks safe to execute."}</p>
                  </div>
                </div>

                {/* Warnings */}
                {riskProfile.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-red-400">Risk Warnings</h4>
                    <ul className="space-y-2">
                      {riskProfile.warnings.map((warn, i) => (
                        <li key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-200 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                          {warn}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Insights & Gas */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))]">Transaction Insights</h4>
                  <ul className="space-y-2">
                    {riskProfile.insights.map((insight, i) => (
                      <li key={i} className="bg-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/20 rounded-xl p-3 text-sm text-white/80 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] mt-1.5 flex-shrink-0"></div>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={confirmTransaction}
                  className="w-full mt-4 btn-glow flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 transition-all px-6 py-4 rounded-2xl font-bold text-white shadow-lg text-lg"
                >
                  Confirm & Broadcast Transaction
                </button>
                <button 
                  onClick={() => setRiskProfile(null)}
                  className="w-full -mt-2 py-3 text-white/50 hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel & Edit Details
                </button>

              </div>
            )}
          </section>

          {txStatus && (
            <div className="glass-panel p-4 rounded-2xl text-center border-white/20 font-mono text-sm animate-in fade-in slide-in-from-top-2">
              <span className="text-[hsl(var(--primary))] tracking-wide">{txStatus}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;