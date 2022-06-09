import {
  createApproveInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey, sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const base58 = require("bs58");

/* The transaction:
 * - sends 0.01 SOL from Buyer to Seller
 * - sends 1 token from Seller to Buyer
 * - is partially signed by Seller, so Buyer can approve + send it
 */

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // chloe
  const buyerPubKey = new PublicKey(
    "3eg3bJ7ydL6SpFRy3QAxCykhQup3LwC1YAbCTWwnVFJM"
  );
  // alex
  const sellerKeypair = Keypair.fromSecretKey(
    base58.decode(
      "5eBU3GmWaNEsmMpywu8i2df8KLLBYS8kgTXSp8acwuTz2nV1BkUUQuHAXTHcc5xosGozmevXBg8PBZUJkbhkEYLz"
    )
  );
  const tokenAddress = new PublicKey(
    "6Qxc5ERNnGMTWU5eBbqcf8KE3XAHo5ZoW667Q92UEa5z"
  );
  const sellerATA = await getOrCreateAssociatedTokenAccount(
    connection,
    sellerKeypair,
    tokenAddress,
    sellerKeypair.publicKey
  )

  // Buyer may not have a token account, so Seller creates one if not
  const buyerATA = await getOrCreateAssociatedTokenAccount(
    connection,
    sellerKeypair, // Bob pays the fee to create it
    tokenAddress, // which token the account is for
    buyerPubKey // who the token account is for
  );

  // Get the details about the token mint
  const tokenMint = await getMint(connection, tokenAddress);

  // Get a recent blockhash to include in the transaction
  const {blockhash} = await connection.getLatestBlockhash("finalized");

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    // Buyer pays the transaction fee
    feePayer: sellerKeypair.publicKey,
  });

  // Transfer 0.2 SOL from Buyer -> Seller
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: buyerPubKey,
      toPubkey: sellerKeypair.publicKey,
      lamports: 0.2 * LAMPORTS_PER_SOL,
    })
  );

  transaction.add(
    createApproveInstruction(
      sellerKeypair.publicKey,
      buyerPubKey,
      buyerPubKey,
      0.2 * LAMPORTS_PER_SOL
    )
  )

  // Transfer 1 token from Seller -> Buyer
  transaction.add(
    createTransferCheckedInstruction(
      sellerATA.address, // source
      tokenAddress, // mint
      buyerATA.address, // destination
      sellerKeypair.publicKey, // owner of source account
      1 * 10 ** tokenMint.decimals, // amount to transfer
      tokenMint.decimals // decimals of token
    )
  );

  // Partial sign as Seller
  transaction.partialSign(sellerKeypair);

  // await connection.sendTransaction(transaction, [sellerKeypair])

  // // Serialize the transaction and convert to base64 to return it
  // const serializedTransaction = transaction.serialize({
  //   // We will need Buyer to deserialize and sign the transaction
  //   requireAllSignatures: false,
  // });
  // const transactionBase64 = serializedTransaction.toString("base64");
  // return transactionBase64;
  //
  // // The caller of this can convert it back to a transaction object:
  // const recoveredTransaction = Transaction.from(
  //   Buffer.from(transactionBase64, "base64")
  // );
})();
