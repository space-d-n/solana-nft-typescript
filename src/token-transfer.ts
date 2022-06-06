import {clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";
import {getOrCreateAssociatedTokenAccount, transferChecked} from "@solana/spl-token";
import * as bs58 from "bs58";

(async () => {
  // connection
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // wallet3
  const owner = Keypair.fromSecretKey(
    bs58.decode(
      "fQ7PnQj1qYtztdYSUe9zHdJm24oVXDcCZqEzMrfhj6sWJGKCXDuaf3mFLLyTRRt81zEs1FL9pcYL9kjp4C4kp7P"
    )
  );

  const ownerBalance = await connection.getBalance(owner.publicKey)
  console.log(`owner balance ${ownerBalance}`)

  // wallet1
  const receiver = Keypair.fromSecretKey(
    bs58.decode(
      "5eBU3GmWaNEsmMpywu8i2df8KLLBYS8kgTXSp8acwuTz2nV1BkUUQuHAXTHcc5xosGozmevXBg8PBZUJkbhkEYLz"
    )
  );

  const receiverBalance = await connection.getBalance(receiver.publicKey)
  console.log(`receiver balance ${receiverBalance}`)

  const mintPubkey = new PublicKey(
    "6Qxc5ERNnGMTWU5eBbqcf8KE3XAHo5ZoW667Q92UEa5z"
  );

  const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    owner,
    mintPubkey,
    owner.publicKey
  )
  console.log(`owner ATA: ${ownerTokenAccount.address.toBase58()}`);
  console.log(`owner ATA: ${ownerTokenAccount.owner.toBase58()}`);
  console.log(`owner ATA: ${ownerTokenAccount.amount}`);
  console.log(`owner ATA: ${ownerTokenAccount.mint.toBase58()}`);

  const ownerTokenAccountBalance = await connection.getBalance(ownerTokenAccount.address)
  console.log(`ownerTokenAccount balance ${ownerTokenAccountBalance}`)


  // calculate ATA
  let receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    owner,
    mintPubkey, // mint
    receiver.publicKey // owner
  );
  console.log(`receiver ATA: ${receiverTokenAccount.address.toBase58()}`);

  const receiverTokenAccountBalance = await connection.getBalance(receiverTokenAccount.address)
  console.log(`receiverTokenAccount balance ${receiverTokenAccountBalance}`)

  // if your wallet is off-curve, you should use
  // let ata = await getAssociatedTokenAddress(
  //   mintPubkey, // mint
  //   alice.publicKey // owner
  //   true, // allowOwnerOffCurve
  // );

  let txhash = await transferChecked(
    connection, // connection
    owner, // payer
    ownerTokenAccount.address, // from (should be a token account)
    mintPubkey, // mint
    receiverTokenAccount.address, // to (should be a token account)
    owner.publicKey, // from's owner
    1e8, // amount, if your deciamls is 8, send 10^8 for 1 token
    8 // decimals
  );
  console.log(`txhash: ${txhash}`);
})();
