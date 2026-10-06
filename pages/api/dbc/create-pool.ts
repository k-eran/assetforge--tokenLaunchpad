import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, symbol, metadataUri, wallet } = req.body as { name?: string; symbol?: string; metadataUri?: string; wallet?: string };
  const rpcUrl = process.env.RPC_URL;
  const configKey = process.env.POOL_CONFIG_KEY;
  if (!rpcUrl || !configKey) return res.status(503).json({ error: 'Live DBC mode is not configured. Add RPC_URL and POOL_CONFIG_KEY.' });
  if (!name || !symbol || !metadataUri || !wallet) return res.status(400).json({ error: 'Name, symbol, metadata URI, and wallet are required.' });
  try {
    const payer = new PublicKey(wallet);
    const connection = new Connection(rpcUrl, 'confirmed');
    const client = new DynamicBondingCurveClient(connection, 'confirmed');
    const baseMint = Keypair.generate();
    const transaction = await client.creator.createPool({ config: new PublicKey(configKey), baseMint: baseMint.publicKey, name, symbol, uri: metadataUri, payer, poolCreator: payer });
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.feePayer = payer;
    transaction.recentBlockhash = blockhash;
    return res.status(200).json({ message: 'DBC transaction prepared for wallet signing.', mint: baseMint.publicKey.toBase58(), transaction: transaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64') });
  } catch (error) { return res.status(400).json({ error: error instanceof Error ? error.message : 'Could not prepare DBC transaction.' }); }
}