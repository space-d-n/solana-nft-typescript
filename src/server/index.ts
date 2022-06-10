import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import BigNumber from 'bignumber.js';
import {PublicKey, Transaction} from "@solana/web3.js";
import {createTransfer} from "@solana/pay";
import {connection} from "./connection";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send(`Express + TypeScript Server`);
});

app.post('/donate', async (req: Request, res: Response) => {
  console.log(`post req url ${req.url}`)
  /*
    Transfer request params provided in the URL by the app client. In practice, these should be generated on the server,
    persisted along with an unpredictable opaque ID representing the payment, and the ID be passed to the app client,
    which will include the ID in the transaction request URL. This prevents tampering with the transaction request.
    */
  const recipientField = req.query.recipient;
  if (!recipientField) throw new Error('missing recipient');
  if (typeof recipientField !== 'string') throw new Error('invalid recipient');
  const recipient = new PublicKey(recipientField);

  const amountField = req.query.amount;
  if (!amountField) throw new Error('missing amount');
  if (typeof amountField !== 'string') throw new Error('invalid amount');
  const amount = new BigNumber(amountField);

  const messageParam = req.query.message;
  if (messageParam && typeof messageParam !== 'string') throw new Error('invalid message');
  const message = messageParam || undefined;

  // Account provided in the transaction request body by the wallet.
  const accountField = req.body?.account;
  if (!accountField) throw new Error('missing account');
  if (typeof accountField !== 'string') throw new Error('invalid account');
  const account = new PublicKey(accountField);

  // Compose a simple transfer transaction to return. In practice, this can be any transaction, and may be signed.
  let transaction = await createTransfer(
    connection,
    account, {
      recipient,
      amount,
      // splToken,
      // reference,
      // memo,
    });

  // Serialize and deserialize the transaction. This ensures consistent ordering of the account keys for signing.
  transaction = Transaction.from(
    transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
    })
  );

  // Serialize and return the unsigned transaction.
  const serialized = transaction.serialize({
    verifySignatures: false,
    requireAllSignatures: false,
  });
  const base64 = serialized.toString('base64');

  res.status(200).send({transaction: base64, message});
})

app.get('/donate', async (req: Request, res: Response) => {
  console.log(`get req url ${req.url}`)
  res.status(200).send({label: "transaction request", icon: "https://w7.pngwing.com/pngs/34/292/png-transparent-sunglasses-thug-life-cool-miscellaneous-angle-white.png"});
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});