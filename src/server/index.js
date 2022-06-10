"use strict";
exports.__esModule = true;
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var pay_1 = require("@solana/pay");
var Util_1 = require("../Util");
dotenv_1["default"].config();
var app = (0, express_1["default"])();
var port = process.env.SERVER_PORT;
app.get('/', function (req, res) {
    var qr = (0, pay_1.createQR)((0, Util_1.constructUrl)("BHmPGsD73MtK1XzFwNTuFYXoSsTcig7HWbwbq9MufBLv", 0.1));
    res.send("Express + TypeScript Server ".concat(qr));
});
app.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:".concat(port));
});
