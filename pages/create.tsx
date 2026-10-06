import { useMemo, useState } from 'react';
import { useWallet } from '@jup-ag/wallet-adapter';
import { useRouter } from 'next/router';
import { AssetCategory, recommendedStrategy, strategies } from '@/lib/data';
import { DemoBadge, Shell } from '@/components/Shell';

const categories: AssetCategory[] = ['Stock-linked', 'RWA', 'AI', 'Meme', 'Custom'];
const steps = ['Asset', 'Strategy', 'Configuration', 'Review', 'Launch'];

export default function Create() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<AssetCategory>('Stock-linked');
  const [name, setName] = useState('TeslaX');
  const [symbol, setSymbol] = useState('TSX');
  const [description, setDescription] = useState('A demo stock-linked asset for gradual on-chain price discovery.');
  const [selectedId, setSelectedId] = useState(() => typeof router.query.strategy === 'string' ? router.query.strategy : 'stock-discovery');
  const selected = strategies.find((item) => item.id === selectedId) ?? recommendedStrategy(category);
  const recommendation = useMemo(() => recommendedStrategy(category), [category]);
  const [status, setStatus] = useState('');

  function next() { setStep((current) => Math.min(current + 1, 4)); }
  async function launch() {
    if (!publicKey) { setStatus('Connect a wallet before preparing a live transaction.'); return; }
    setStatus('Preparing transaction...');
    try {
      const response = await fetch('/api/dbc/create-pool', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, symbol, description, wallet: publicKey.toBase58(), metadataUri: '' }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to prepare the DBC transaction.');
      setStatus('Transaction prepared. Wallet signing is the next step.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to prepare launch.'); }
  }

  return <Shell><main><div className="page-title"><div><div className="eyebrow">Create / guided launch</div><h1>Forge an asset.</h1><p>AssetForge recommends a strategy first, then shows the DBC settings it will use.</p></div><DemoBadge /></div><div className="wizard"><aside className="wizard-nav">{steps.map((item, index) => <div className={`wizard-step ${step === index ? 'active' : ''}`} key={item}><b>0{index + 1}</b>{item}</div>)}</aside><section className="panel">
    {step === 0 && <><h2>What are you launching?</h2><p>Start with an asset category. This changes the recommended launch strategy, not the legal status of the asset.</p><div className="form-grid"><div className="field"><label>Asset name</label><input value={name} onChange={(event) => setName(event.target.value)} /></div><div className="field"><label>Symbol</label><input value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase())} maxLength={8} /></div><div className="field full"><label>Description</label><input value={description} onChange={(event) => setDescription(event.target.value)} /></div><div className="field full"><label>Asset category</label><div className="filters">{categories.map((item) => <button className={`filter ${category === item ? 'active' : ''}`} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div></div></>}
    {step === 1 && <><h2>Choose a launch strategy.</h2><p>These product names are AssetForge concepts mapped to a compatible DBC configuration.</p><div className="strategy-grid">{strategies.map((strategy) => <button className={`strategy-card ${selectedId === strategy.id ? 'selected' : ''}`} key={strategy.id} onClick={() => setSelectedId(strategy.id)}><span className="strategy-tag">{strategy.category} assets</span><h3>{strategy.name}</h3><p>{strategy.description}</p><div className="strategy-bottom"><span>{strategy.style}</span><span className="trade-link">{selectedId === strategy.id ? 'Selected' : 'Select'}</span></div></button>)}</div><div className="recommend"><strong>Recommended for {category}: {recommendation.name}</strong><p>{recommendation.description}</p></div></>}
    {step === 2 && <><h2>Review configuration.</h2><p>Beginner-friendly settings backed by the selected DBC config key in live mode.</p><div className="form-grid"><div className="field"><label>Starting price</label><input value={`$${selected.startingPrice}`} readOnly /></div><div className="field"><label>Trading fee</label><input value={`${(selected.feeBps / 100).toFixed(2)}%`} readOnly /></div><div className="field"><label>Graduation threshold</label><input value={`$${selected.graduationTarget.toLocaleString()}`} readOnly /></div><div className="field"><label>Quote token</label><select defaultValue="USDC"><option>USDC</option><option>SOL</option></select></div></div><div className="recommend"><strong>Meteora DBC</strong><p>AssetForge will delegate price discovery to Meteora&apos;s Dynamic Bonding Curve. The chart is a configuration preview, not a prediction of market behavior.</p></div></>}
    {step === 3 && <><h2>Everything ready?</h2><p>Check the launch details before the wallet transaction is prepared.</p><div className="asset-meta"><span>Asset<br /><strong>{name} · {symbol}</strong></span><span>Category<br /><strong>{category}</strong></span></div><div className="asset-meta"><span>Strategy<br /><strong>{selected.name}</strong></span><span>Starting price<br /><strong>${selected.startingPrice}</strong></span></div><div className="asset-meta"><span>Trading fee<br /><strong>{(selected.feeBps / 100).toFixed(2)}%</strong></span><span>Graduation<br /><strong>${selected.graduationTarget.toLocaleString()}</strong></span></div><div className="recommend"><strong>Before signing</strong><p>You are preparing a Solana transaction for Meteora DBC. No signature or transaction is created in demo mode.</p></div></>}
    {step === 4 && <><h2>Launch status.</h2><p>{status || 'The launch adapter is ready when a DBC config key and metadata storage are configured.'}</p><div className="recommend"><strong>Live integration boundary</strong><p>The server uses Meteora&apos;s documented <code>DynamicBondingCurveClient.creator.createPool</code> flow. Add <code>POOL_CONFIG_KEY</code> and a metadata URI to prepare a real transaction.</p></div><button className="button-primary" onClick={launch}>Prepare DBC transaction</button></>}
    {step < 4 && <div className="wizard-actions"><button className="button-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>Back</button><button className="button-primary" onClick={next}>{step === 3 ? 'Launch asset' : 'Continue ↗'}</button></div>}
  </section></div></main></Shell>;
}