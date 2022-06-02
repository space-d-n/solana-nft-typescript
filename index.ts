import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from  "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";

(async () => {
// Connect to cluster
  const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
})

