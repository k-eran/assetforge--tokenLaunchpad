# AssetForge

AssetForge is a guided asset launchpad concept for the Meteora-focused hackathon. It turns an asset category into a launch strategy, then maps that strategy to a verified Meteora Dynamic Bonding Curve configuration.

## Current implementation

- Responsive AssetForge product UI: landing, explore, strategies, creator dashboard, create wizard, and asset detail/trading views.
- Phantom and Solflare wallet connection through Jupiter's unified wallet adapter.
- Strategy engine with Stock Discovery, RWA Stable, AI Growth, Meme Fast, and Custom presets.
- Demo metrics and charts are labeled `DEMO MODE` and never produce fake transaction signatures.
- A server route for Meteora's documented `DynamicBondingCurveClient.creator.createPool` flow. It only activates when `RPC_URL`, `POOL_CONFIG_KEY`, and a real metadata URI are configured.

## Meteora integration

The official Fun Launch scaffold was inspected before implementation. Its server-side pool creation pattern is preserved in `pages/api/dbc/create-pool.ts`: create a `DynamicBondingCurveClient`, call `creator.createPool`, set the wallet payer and recent blockhash, and return an unsigned transaction for wallet signing. The DBC SDK is installed from `@meteora-ag/dynamic-bonding-curve-sdk`.

Post-graduation DAMM v2 is represented in the product lifecycle and README architecture, but no migration transaction is fabricated. The next live slice should read the DBC migration state and use `@meteora-ag/cp-amm-sdk` only after the target pool/config flow is verified against the current official SDK.

## Run locally

Requirements: Node.js 22+ and pnpm 10+.

```bash
pnpm install --config.ignore-scripts=true
copy .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`. The default environment is Solana devnet. Demo pages work without secrets; live DBC preparation requires `RPC_URL`, `POOL_CONFIG_KEY`, and a metadata URI supplied by the future storage adapter.

## Architecture

```text
Creator -> AssetForge strategy engine -> Meteora DBC -> trading -> graduation -> DAMM v2
```

No private keys or seed phrases are collected or stored. The browser wallet remains responsible for signing.