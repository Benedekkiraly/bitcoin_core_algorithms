//this script is based on demonstratory code-snippets found at https://github.com/mruddy/bip65-demos/blob/master/freeze.js
"use strict"
const args = require("./args-regtest.js");
const bitcore = require("bitcore-lib");
bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
//setting the block height for the freezing function
const LOCK_UNTIL_BLOCK = 150;

var privateKey = new bitcore.PrivateKey();

var address = privateKey.toAddress();

//creating the sender address, hardcoding variables
var address1 = {
  "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
  "outputIndex" : 0,
  "address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
  "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
  "satoshis" : 50000
};

//generating the receiver address with the reedemScript
const redeemScript = bitcore.Script.empty()
  .add(bitcore.crypto.BN.fromNumber(LOCK_UNTIL_BLOCK).toScriptNumBuffer())
  .add('OP_CHECKLOCKTIMEVERIFY').add('OP_DROP')
  .add(bitcore.Script.buildPublicKeyHashOut(privateKey.toAddress()));

const p2shAddress = bitcore.Address.payingTo(redeemScript);

//first we send from our created address(address1) to the generated for later freezing
const freezeTransaction = new bitcore.Transaction().from({
  txid: args.txid, 
  vout: Number(args.vout),
  scriptPubKey: args.scriptPubKey,
  satoshis: Number(args.satoshis),
})
.to(p2shAddress, Number(args.satoshis) - 100000)
.sign(privateKey);

//creating the freezing transaction from address2 back to address1
const getSpendTransaction = function(lockTime, sequenceNumber) {
  var address2= {
  "txId" : freezeTransaction.id,
  "outputIndex" : 0,
  "address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
  "script" :  redeemScript.toScriptHashOut(),
  "satoshis" : 50000
  };
  const result = new bitcore.Transaction()
  .from(address1)
  .to(address,5000)
  .lockUntilBlockHeight(lockTime);
  // the CLTV opcode requires that the input sequence number is not finalized
  result.inputs[0].sequenceNumber = sequenceNumber;

  const signature = bitcore.Transaction.sighash.sign(
    result,
    privateKey,
    bitcore.crypto.Signature.SIGHASH_ALL,
    0,
    redeemScript
  );

  // setup the scriptSig of the spending transaction to spend the p2sh-cltv-p2pkh redeem script
  result.inputs[0].setScript(
    bitcore.Script.empty()
    .add(signature.toTxFormat())
    .add(privateKey.toPublicKey().toBuffer())
    .add(redeemScript.toBuffer())
  );

  return result;
};

//trying to spend from frozen address with lower block height
const brokenSpendTransaction = getSpendTransaction(100, 0xffffffff);

//formatting output of transactions
const result = {
  fromAddress: privateKey.toAddress().toString(),
  p2shAddress: p2shAddress.toString(),
  redeemScript: redeemScript.toString(),
  freezeTransaction: {
    txid: freezeTransaction.id,
    raw: freezeTransaction.serialize(true),
  },
  brokenSpendTransaction: {
    txid: brokenSpendTransaction.id,
    raw: brokenSpendTransaction.serialize(true),
  },
};

console.log(JSON.stringify(result, null, 2));
