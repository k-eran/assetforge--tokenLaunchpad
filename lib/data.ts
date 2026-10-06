export type AssetCategory = 'Stock-linked' | 'RWA' | 'AI' | 'Meme' | 'Custom';
export type LaunchStrategy = { id: string; name: string; category: AssetCategory | 'Any'; description: string; style: string; feeBps: number; graduationTarget: number; startingPrice: number };

export const strategies: LaunchStrategy[] = [
  { id: 'stock-discovery', name: 'Stock Discovery', category: 'Stock-linked', description: 'A patient launch path for assets where gradual price discovery matters.', style: 'Gradual price discovery', feeBps: 25, graduationTarget: 100000, startingPrice: 10 },
  { id: 'rwa-stable', name: 'RWA Stable', category: 'RWA', description: 'Controlled parameters for real-world themed assets with a measured start.', style: 'Controlled price discovery', feeBps: 30, graduationTarget: 125000, startingPrice: 1 },
  { id: 'ai-growth', name: 'AI Growth', category: 'AI', description: 'A growth-oriented launch for fast-moving technical communities.', style: 'Growth-oriented launch', feeBps: 50, graduationTarget: 75000, startingPrice: 0.1 },
  { id: 'meme-fast', name: 'Meme Fast', category: 'Meme', description: 'A compact route for community-led launches and quick discovery.', style: 'Fast community launch', feeBps: 100, graduationTarget: 50000, startingPrice: 0.01 },
  { id: 'custom', name: 'Custom', category: 'Any', description: 'Start from a compatible DBC configuration and make the choices your own.', style: 'Configure your own strategy', feeBps: 50, graduationTarget: 100000, startingPrice: 1 },
];

export const assets = [
  { address: 'teslax-demo', name: 'TeslaX', symbol: 'TSX', category: 'Stock-linked' as AssetCategory, price: 17.42, change: 8.42, volume: '82.4K', liquidity: '91.0K', progress: 91, status: 'Graduating', accent: '#f3b562' },
  { address: 'neuralmesh-demo', name: 'Neural Mesh', symbol: 'NMSH', category: 'AI' as AssetCategory, price: 2.84, change: 14.8, volume: '44.1K', liquidity: '63.8K', progress: 64, status: 'Trading', accent: '#8bc6ff' },
  { address: 'carbon-credit-demo', name: 'Carbon Credit', symbol: 'CARB', category: 'RWA' as AssetCategory, price: 1.08, change: -2.1, volume: '18.7K', liquidity: '32.4K', progress: 38, status: 'Launching', accent: '#8ed1a7' },
  { address: 'pixel-punch-demo', name: 'Pixel Punch', symbol: 'PXL', category: 'Meme' as AssetCategory, price: 0.09, change: 22.3, volume: '91.2K', liquidity: '70.6K', progress: 78, status: 'Graduating', accent: '#ed8fb3' },
];
export function recommendedStrategy(category: AssetCategory) { return strategies.find((strategy) => strategy.category === category) ?? strategies[4]; }