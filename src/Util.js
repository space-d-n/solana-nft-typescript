"use strict";
exports.__esModule = true;
exports.constructUrl = void 0;
function constructUrl(receipient, amount) {
    return "http://".concat(process.env.SERVER_URL, ":").concat(process.env.SERVER_PORT, "?receipient=").concat(receipient, "&amount=").concat(amount);
}
exports.constructUrl = constructUrl;
