import Link from 'next/link';
import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';
function shorten(value: string) { return `${value.slice(0, 4)}...${value.slice(-4)}`; }
export function Shell({ children }: { children: React.ReactNode }) {
  const { setShowModal } = useUnifiedWalletContext(); const { publicKey, disconnect } = useWallet();
  return <div className="app-shell"><header className="topbar"><Link href="/" className="brand"><span className="brand-mark">A</span><span>Asset<span>Forge</span></span></Link><nav><Link href="/explore">Explore</Link><Link href="/create">Launch</Link><Link href="/strategies">Strategies</Link><Link href="/dashboard">Dashboard</Link></nav>{publicKey ? <button className="wallet-button connected" onClick={() => disconnect()}><i />{shorten(publicKey.toBase58())}</button> : <button className="wallet-button" onClick={() => setShowModal(true)}>Connect wallet <b>↗</b></button>}</header>{children}<footer><span>AssetForge</span><span>Built on Solana · Powered by Meteora</span><span>Demo environment</span></footer></div>;
}
export function DemoBadge() { return <span className="demo-badge"><i /> DEMO MODE</span>; }