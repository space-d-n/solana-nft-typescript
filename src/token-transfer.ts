import {clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction,} from "@solana/web3.js";
import {
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction, createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import * as bs58 from "bs58";

(async () => {
  // connection
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // wallet2 - keygen
  const fromWallet = Keypair.fromSecretKey(
    bs58.decode(
      "fBSh6QDa3uzDFEDr4bf1wir7cQYKn6PgLEmLSihKAPxFyoXVUDxLC4qzndBTtoMZcu67waF4gJyZcGyP5Am845B"
    )
  );

  // wallet3
  const toWallet = Keypair.fromSecretKey(
    bs58.decode(
      "fQ7PnQj1qYtztdYSUe9zHdJm24oVXDcCZqEzMrfhj6sWJGKCXDuaf3mFLLyTRRt81zEs1FL9pcYL9kjp4C4kp7P"
    )
  );

  const mintPubkey = new PublicKey(
    "96mGeFMgdrZwEVPLKhpM5zTKmbR9odyhpEUbpW9pTckx"
  );

  // 1) use build-in function
  // {
  //   let ata = await createAssociatedTokenAccount(
  //     connection, // connection
  //     feePayer, // fee payer
  //     mintPubkey, // mint
  //     toWallet.publicKey // owner,
  //   );
  //   console.log(`ATA: ${ata.toBase58()}`);
  // }

  // or

  // 2) composed by yourself
  {
    // calculate ATA
    let ata = await getAssociatedTokenAddress(
      mintPubkey, // mint
      toWallet.publicKey // owner
    );
    console.log(`ATA: ${ata.toBase58()}`);

    // if your wallet is off-curve, you should use
    // let ata = await getAssociatedTokenAddress(
    //   mintPubkey, // mint
    //   alice.publicKey // owner
    //   true, // allowOwnerOffCurve
    // );

    let tx = new Transaction()

    tx.add(
      createAssociatedTokenAccountInstruction(
        fromWallet.publicKey, // payer
        ata, // ata
        toWallet.publicKey, // owner
        mintPubkey // mint
      )
    );
    console.log(`txhash: ${await connection.sendTransaction(tx, [fromWallet])}`);

    tx.add(
      createTransferCheckedInstruction(
        mintPubkey, // from (should be a token account)
        mintPubkey, // mint
        ata, // to (should be a token account)
        fromWallet.publicKey, // from's owner
        1e8, // amount, if your deciamls is 8, send 10^8 for 1 token
        8 // decimals
      )
    );
    console.log(
      `txhash: ${await connection.sendTransaction(tx, [
        fromWallet,
        toWallet /* fee payer + owner */,
      ])}`
    );

    await sendAndConfirmTransaction(connection, tx, [fromWallet])
  }

  // 1) use build-in function
  // {
  //   let txhash = await transferChecked(
  //     connection, // connection
  //     feePayer, // payer
  //     tokenAccountXPubkey, // from (should be a token account)
  //     mintPubkey, // mint
  //     tokenAccountYPubkey, // to (should be a token account)
  //     toWallet, // from's owner
  //     1e8, // amount, if your deciamls is 8, send 10^8 for 1 token
  //     8 // decimals
  //   );
  //   console.log(`txhash: ${txhash}`);
  // }
})();
