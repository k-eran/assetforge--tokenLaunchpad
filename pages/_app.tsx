import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Adapter, UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { useMemo } from 'react';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }: AppProps) {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()] as Adapter[], []);
  return <UnifiedWalletProvider wallets={wallets} config={{
    env: process.env.NEXT_PUBLIC_NETWORK === 'mainnet-beta' ? 'mainnet-beta' : 'devnet', autoConnect: true,
    metadata: { name: 'AssetForge', description: 'Guided asset launches powered by Meteora DBC', url: 'https://assetforge.local', iconUrls: [] },
    theme: 'dark', lang: 'en',
  }}><Toaster theme="dark" position="bottom-right" /><Component {...pageProps} /></UnifiedWalletProvider>;
}