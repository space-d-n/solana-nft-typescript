import {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

(async () => {
  const fromKeypair = Keypair.generate();
  console.log(`from ${fromKeypair.publicKey}`)
  const toKeypair = Keypair.generate();
  console.log(`to ${toKeypair.publicKey}`)

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const airdropSignature = await connection.requestAirdrop(
    fromKeypair.publicKey,
    LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction(airdropSignature);

  const lamportsToSend = 500000000;

  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: lamportsToSend,
    })
  );

  await sendAndConfirmTransaction(connection, transferTransaction, [
    fromKeypair,
  ]);
})();
