"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var spl_token_1 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var base58 = require("bs58");
/* The transaction:
 * - sends 0.01 SOL from Buyer to Seller
 * - sends 1 token from Seller to Buyer
 * - is partially signed by Seller, so Buyer can approve + send it
 */
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, buyerPubKey, sellerKeypair, tokenAddress, sellerATA, buyerATA, tokenMint, blockhash, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
                buyerPubKey = new web3_js_1.PublicKey("3eg3bJ7ydL6SpFRy3QAxCykhQup3LwC1YAbCTWwnVFJM");
                sellerKeypair = web3_js_1.Keypair.fromSecretKey(base58.decode("5eBU3GmWaNEsmMpywu8i2df8KLLBYS8kgTXSp8acwuTz2nV1BkUUQuHAXTHcc5xosGozmevXBg8PBZUJkbhkEYLz"));
                tokenAddress = new web3_js_1.PublicKey("6Qxc5ERNnGMTWU5eBbqcf8KE3XAHo5ZoW667Q92UEa5z");
                return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, sellerKeypair, tokenAddress, sellerKeypair.publicKey)
                    // Buyer may not have a token account, so Seller creates one if not
                ];
            case 1:
                sellerATA = _a.sent();
                return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, sellerKeypair, // Bob pays the fee to create it
                    tokenAddress, // which token the account is for
                    buyerPubKey // who the token account is for
                    )];
            case 2:
                buyerATA = _a.sent();
                return [4 /*yield*/, (0, spl_token_1.getMint)(connection, tokenAddress)];
            case 3:
                tokenMint = _a.sent();
                return [4 /*yield*/, connection.getLatestBlockhash("finalized")];
            case 4:
                blockhash = (_a.sent()).blockhash;
                transaction = new web3_js_1.Transaction({
                    recentBlockhash: blockhash,
                    // Buyer pays the transaction fee
                    feePayer: sellerKeypair.publicKey
                });
                // Transfer 0.2 SOL from Buyer -> Seller
                transaction.add(web3_js_1.SystemProgram.transfer({
                    fromPubkey: buyerPubKey,
                    toPubkey: sellerKeypair.publicKey,
                    lamports: 0.2 * web3_js_1.LAMPORTS_PER_SOL
                }));
                transaction.add((0, spl_token_1.createApproveInstruction)(sellerKeypair.publicKey, buyerPubKey, buyerPubKey, 0.2 * web3_js_1.LAMPORTS_PER_SOL));
                // Transfer 1 token from Seller -> Buyer
                transaction.add((0, spl_token_1.createTransferCheckedInstruction)(sellerATA.address, // source
                tokenAddress, // mint
                buyerATA.address, // destination
                sellerKeypair.publicKey, // owner of source account
                1 * Math.pow(10, tokenMint.decimals), // amount to transfer
                tokenMint.decimals // decimals of token
                ));
                // Partial sign as Seller
                transaction.partialSign(sellerKeypair);
                return [4 /*yield*/, connection.sendTransaction(transaction, [sellerKeypair])
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
                ];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
