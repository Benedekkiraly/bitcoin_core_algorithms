"use strict";
const LOCK_UNTIL_BLOCK = 150; // pick a block height above the currenttip
const bitcore = require("bitcore-lib");
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
var privateKey = new bitcore.PrivateKey();
var address = privateKey.toAddress();
console.log(privateKey);
console.log(address);
//Just to get started with bitcore-lib
