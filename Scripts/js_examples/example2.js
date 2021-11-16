'use strict';
console.log("Setting block-height for blocking transaction!");
const LOCK_UNTIL_BLOCK = 150; // pick a block height above the currenttip

const bitcore = require("bitcore-lib"); 

bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;

var privateKey = new bitcore.PrivateKey();
var address = privateKey.toAddress();
console.log("Generating sender address!");
var sender = {
"txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
"outputIndex" : 0,
"address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
"script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
"satoshis" : 2e9
};
var receiver = {
"txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308987",
"outputIndex" : 0,
"address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaX",
"script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ae",
"satoshis" : 0
};
console.log("Sending 10 BTC from sender to receiver!");

var transaction1 = new bitcore.Transaction()
.from(sender)
.to("1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK", 1e9)
.sign(privateKey);
console.log(JSON.stringify(transaction1, null, 2));

const redeemScript = bitcore.Script.empty()
  // useful generic way to get the minimal encoding of the locktime stack argument, copied from the internet
  .add(bitcore.crypto.BN.fromNumber(LOCK_UNTIL_BLOCK).toScriptNumBuffer())
  .add('OP_CHECKLOCKTIMEVERIFY').add('OP_DROP')
  .add(bitcore.Script.buildPublicKeyHashOut(address));

var freezeTrans = new bitcore.Transaction().from({
    txid: transaction1.id,
    vout: 0,
    scriptPubKey: redeemScript.toScriptHashOut(),
    satoshis: 1e9,
  })
  // Trying to send back the amount to the sender
  .to(sender, 1e9)
  // CLTV requires the transaction nLockTime to be >= the stack argument in the redeem script
  .lockUntilBlockHeight(LOCK_UNTIL_BLOCK);
  // the CLTV opcode requires that the input's sequence number not be finalized
  result.inputs[0].sequenceNumber = 0;//0xffffffff;

console.log("Transaction log: ");
console.log(JSON.stringify(freezeTrans, null, 2));
