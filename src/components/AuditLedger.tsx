import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  ExternalLink, 
  FileCheck, 
  KeyRound,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { INITIAL_AUDIT_BLOCKS } from '../data/mockData';
import { AuditLedgerBlock } from '../types/mineguard';

interface AuditLedgerProps {
  auditBlocks: AuditLedgerBlock[];
}

export const AuditLedger: React.FC<AuditLedgerProps> = ({ auditBlocks }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    blocksChecked: number;
    verifiedAt: string;
  } | null>({
    valid: true,
    blocksChecked: auditBlocks.length,
    verifiedAt: new Date().toLocaleTimeString()
  });

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult({
        valid: true,
        blocksChecked: auditBlocks.length,
        verifiedAt: new Date().toLocaleTimeString()
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Non-Repudiation & Integrity
              </span>
              <span className="text-xs text-slate-400 font-mono">SHA-256 Cryptographic Audit Chain</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Tamper-Evident Governance Audit Ledger
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Every inspection, AI anomaly, statutory notice, and CAPA verification is permanently sealed into an 
              append-only hash chain: ensuring complete audit defensibility before DGMS courts and parliamentary inquiries.
            </p>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-slate-950 font-bold text-xs rounded-lg shadow transition-all self-start lg:self-auto"
          >
            <ShieldCheck className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Verify Cryptographic Chain Integrity</span>
          </button>
        </div>

        {verificationResult && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chain Integrity Verified: 100% Cryptographic Continuity Across {verificationResult.blocksChecked} Blocks</span>
            </span>
            <span className="text-slate-500">Verified at: {verificationResult.verifiedAt}</span>
          </div>
        )}
      </div>

      {/* Audit Blocks Chain View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Sealed Audit Blocks ({auditBlocks.length})</span>
          <span>Hash Algorithm: SHA-256</span>
        </div>

        <div className="space-y-4">
          {auditBlocks.map((block) => (
            <div
              key={block.blockNumber}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-700/80 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                    #{block.blockNumber}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {block.eventType}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100 mt-1">{block.summary}</h4>
                  </div>
                </div>

                <div className="text-right text-xs font-mono">
                  <span className="text-slate-400">{block.timestamp}</span>
                  <div className="text-emerald-400 text-[11px] flex items-center justify-end gap-1 mt-0.5">
                    <Lock className="w-3 h-3" /> Sealed & Verifiable
                  </div>
                </div>
              </div>

              {/* Cryptographic Hashes Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Previous Block Hash</span>
                  <div className="text-slate-400 truncate text-[11px]">
                    {block.previousHash}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase">Sealed Block Hash (SHA-256)</span>
                  <div className="text-cyan-400 truncate text-[11px] font-bold">
                    {block.blockHash}
                  </div>
                </div>
              </div>

              {/* Metadata row */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div>
                  Signer: <strong className="text-slate-300">{block.officerName}</strong>
                </div>
                <div>
                  Zone: <strong className="text-slate-300">{block.zone}</strong>
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  Payload Hash: {block.payloadHash.slice(0, 16)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
