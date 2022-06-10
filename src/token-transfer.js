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
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var bs58 = require("bs58");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, owner, ownerBalance, receiver, receiverBalance, mintPubkey, ownerTokenAccount, ownerTokenAccountBalance, receiverTokenAccount, receiverTokenAccountBalance, transferTx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
                owner = web3_js_1.Keypair.fromSecretKey(bs58.decode("fQ7PnQj1qYtztdYSUe9zHdJm24oVXDcCZqEzMrfhj6sWJGKCXDuaf3mFLLyTRRt81zEs1FL9pcYL9kjp4C4kp7P"));
                return [4 /*yield*/, connection.getBalance(owner.publicKey)];
            case 1:
                ownerBalance = _a.sent();
                console.log("owner balance ".concat(ownerBalance));
                receiver = web3_js_1.Keypair.fromSecretKey(bs58.decode("5eBU3GmWaNEsmMpywu8i2df8KLLBYS8kgTXSp8acwuTz2nV1BkUUQuHAXTHcc5xosGozmevXBg8PBZUJkbhkEYLz"));
                return [4 /*yield*/, connection.getBalance(receiver.publicKey)];
            case 2:
                receiverBalance = _a.sent();
                console.log("receiver balance ".concat(receiverBalance));
                mintPubkey = new web3_js_1.PublicKey("6Qxc5ERNnGMTWU5eBbqcf8KE3XAHo5ZoW667Q92UEa5z");
                return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, owner, mintPubkey, owner.publicKey)];
            case 3:
                ownerTokenAccount = _a.sent();
                console.log("owner ATA: ".concat(ownerTokenAccount.address.toBase58()));
                console.log("owner ATA: ".concat(ownerTokenAccount.owner.toBase58()));
                console.log("owner ATA: ".concat(ownerTokenAccount.amount));
                console.log("owner ATA: ".concat(ownerTokenAccount.mint.toBase58()));
                return [4 /*yield*/, connection.getBalance(ownerTokenAccount.address)];
            case 4:
                ownerTokenAccountBalance = _a.sent();
                console.log("ownerTokenAccount balance ".concat(ownerTokenAccountBalance));
                return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, owner, mintPubkey, // mint
                    receiver.publicKey // owner
                    )];
            case 5:
                receiverTokenAccount = _a.sent();
                console.log("receiver ATA: ".concat(receiverTokenAccount.address.toBase58()));
                return [4 /*yield*/, connection.getBalance(receiverTokenAccount.address)];
            case 6:
                receiverTokenAccountBalance = _a.sent();
                console.log("receiverTokenAccount balance ".concat(receiverTokenAccountBalance));
                return [4 /*yield*/, (0, spl_token_1.transfer)(connection, owner, ownerTokenAccount.address, receiverTokenAccount.address, owner, 1, [owner])];
            case 7:
                transferTx = _a.sent();
                console.log("transferTx: ".concat(transferTx));
                return [2 /*return*/];
        }
    });
}); })();
