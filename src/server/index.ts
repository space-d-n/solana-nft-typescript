import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import BigNumber from 'bignumber.js';
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base"
import cors from 'cors'
import bodyParser from "body-parser";
import {createTransferInstruction} from "@solana/spl-token";
import {createTransfer} from "@solana/pay";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req: Request, res: Response) => {
  res.send(`Express + TypeScript Server`);
});

app.post('/donate', async (req: Request, res: Response) => {
  try {
    console.log(`post req body ${JSON.stringify(req.body)}`)
    console.log(`post req url ${JSON.stringify(req.url)}`)
    console.log(`post req base url ${JSON.stringify(req.baseUrl)}`)
    console.log(`post req query ${JSON.stringify(req.query)}`)
    console.log(`post req accepted ${JSON.stringify(req.accepted)}`)
    console.log(`post req headers ${JSON.stringify(req.headers)}`)
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
    console.log(`message ${message}`)

    // Account provided in the transaction request body by the wallet.
    const accountField = req.body?.account;
    if (!accountField) throw new Error('missing account');
    if (typeof accountField !== 'string') throw new Error('invalid account');
    const account = new PublicKey(accountField);

    const network = WalletAdapterNetwork.Devnet
    const endpoint = clusterApiUrl(network)
    const connection = new Connection(endpoint)

    // Get a recent blockhash to include in the transaction
    const {blockhash} = await connection.getLatestBlockhash("finalized");

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      // The recipient pays the transaction fee
      feePayer: account,
    })

    const transferIntruction = SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: recipient,
        lamports: amount.multipliedBy(LAMPORTS_PER_SOL).toNumber()
      }
    )

    // Transfer 0.2 SOL from Buyer -> Seller
    transaction.add(transferIntruction);

    // Serialize and return the unsigned transaction.
    const serialized = transaction.serialize({
      requireAllSignatures: false,
    });
    const base64 = serialized.toString('base64');

    res.status(200).send({transaction: base64, message: message});
  } catch (err) {
    console.error(err);

    res.status(500).json({error: 'error creating transaction',})
    return
  }
})

app.get('/donate', async (req: Request, res: Response) => {
  console.log(`get req url ${req.url}`)
  console.log(`get req url ${JSON.stringify(req.query)}`)
  console.log(`get req headers ${JSON.stringify(req.headers)}`)

  res.status(200).send({label: "transaction request", icon: "https://freesvg.org/img/1370962427.png"});
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});