"use strict";
const LOCK_UNTIL_BLOCK = 150; // pick a block height above the currenttip
const bitcore = require("bitcore-lib"); // bitcore-lib should be in thesame folder as the js file
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
var privateKey = new bitcore.PrivateKey();
var address = privateKey.toAddress();
var utxo = {
"txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
"outputIndex" : 0,
"address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
"script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
"satoshis" : 50000
};
var transaction = new bitcore.Transaction()
.from(utxo)
.addData("bitcore rocks") // Add OP_RETURN data
.sign(privateKey);
console.log(JSON.stringify(transaction, null, 2));
//A standard transaction with some data
