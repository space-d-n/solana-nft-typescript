import { Connection } from '@solana/web3.js';

export const connection = new Connection(process.env.CLUSTER_ENDPOINT || 'https://api.devnet.solana.com', 'confirmed');
