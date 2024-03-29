bplist00�_WebMainResource�	
_WebResourceTextEncodingName^WebResourceURL_WebResourceFrameName_WebResourceData_WebResourceMIMETypeUutf-8_file:///index.htmlPO�<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2022.6">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">//this script is based on demonstratory code-snippets found at https://github.com/mruddy/bip65-demos/blob/master/freeze.js</p>
<p class="p1">"use strict"</p>
<p class="p1">const bitcore = require("bitcore-lib");</p>
<p class="p1">bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;</p>
<p class="p1">//setting the block height for the freezing function</p>
<p class="p1">const LOCK_UNTIL_BLOCK = 150;</p>
<p class="p2"><br></p>
<p class="p1">var privateKey = new bitcore.PrivateKey();</p>
<p class="p2"><br></p>
<p class="p1">var address = privateKey.toAddress();</p>
<p class="p2"><br></p>
<p class="p1">//creating the sender address, hardcoding variables</p>
<p class="p1">var address1 = {</p>
<p class="p1"><span class="Apple-converted-space">  </span>"txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",</p>
<p class="p1"><span class="Apple-converted-space">  </span>"outputIndex" : 0,</p>
<p class="p1"><span class="Apple-converted-space">  </span>"address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",</p>
<p class="p1"><span class="Apple-converted-space">  </span>"script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",</p>
<p class="p1"><span class="Apple-converted-space">  </span>"satoshis" : 50000</p>
<p class="p1">};</p>
<p class="p2"><br></p>
<p class="p1">//generating the receiver address with the reedemScript</p>
<p class="p1">const redeemScript = bitcore.Script.empty()</p>
<p class="p1"><span class="Apple-converted-space">  </span>.add(bitcore.crypto.BN.fromNumber(LOCK_UNTIL_BLOCK).toScriptNumBuffer())</p>
<p class="p1"><span class="Apple-converted-space">  </span>.add('OP_CHECKLOCKTIMEVERIFY').add('OP_DROP')</p>
<p class="p1"><span class="Apple-converted-space">  </span>.add(bitcore.Script.buildPublicKeyHashOut(privateKey.toAddress()));</p>
<p class="p2"><br></p>
<p class="p1">const p2shAddress = bitcore.Address.payingTo(redeemScript);</p>
<p class="p2"><br></p>
<p class="p1">//first we send from our created address(address1) to the generated for later freezing</p>
<p class="p1">var freezeTransaction = new bitcore.Transaction()</p>
<p class="p1"><span class="Apple-converted-space">  </span>.from(address1)</p>
<p class="p1"><span class="Apple-converted-space">  </span>.to(p2shAddress, 15000)</p>
<p class="p1"><span class="Apple-converted-space">  </span>.sign(privateKey);</p>
<p class="p2"><br></p>
<p class="p1">//creating the freezing transaction from address2 back to address1</p>
<p class="p1">const getSpendTransaction = function(lockTime, sequenceNumber) {</p>
<p class="p1"><span class="Apple-converted-space">  </span>var address2= {</p>
<p class="p1"><span class="Apple-converted-space">  </span>"txId" : freezeTransaction.id,</p>
<p class="p1"><span class="Apple-converted-space">  </span>"outputIndex" : 0,</p>
<p class="p1"><span class="Apple-converted-space">  </span>"address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",</p>
<p class="p1"><span class="Apple-converted-space">  </span>"script" :<span class="Apple-converted-space">  </span>redeemScript.toScriptHashOut(),</p>
<p class="p1"><span class="Apple-converted-space">  </span>"satoshis" : 50000</p>
<p class="p1"><span class="Apple-converted-space">  </span>};</p>
<p class="p1"><span class="Apple-converted-space">  </span>const result = new bitcore.Transaction()</p>
<p class="p1"><span class="Apple-converted-space">  </span>.from(address1)</p>
<p class="p1"><span class="Apple-converted-space">  </span>.to(address,5000)</p>
<p class="p1"><span class="Apple-converted-space">  </span>.lockUntilBlockHeight(lockTime);</p>
<p class="p1"><span class="Apple-converted-space">  </span>// the CLTV opcode requires that the input sequence number is not finalized</p>
<p class="p1"><span class="Apple-converted-space">  </span>result.inputs[0].sequenceNumber = sequenceNumber;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>const signature = bitcore.Transaction.sighash.sign(</p>
<p class="p1"><span class="Apple-converted-space">    </span>result,</p>
<p class="p1"><span class="Apple-converted-space">    </span>privateKey,</p>
<p class="p1"><span class="Apple-converted-space">    </span>bitcore.crypto.Signature.SIGHASH_ALL,</p>
<p class="p1"><span class="Apple-converted-space">    </span>0,</p>
<p class="p1"><span class="Apple-converted-space">    </span>redeemScript</p>
<p class="p1"><span class="Apple-converted-space">  </span>);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>// setup the scriptSig of the spending transaction to spend the p2sh-cltv-p2pkh redeem script</p>
<p class="p1"><span class="Apple-converted-space">  </span>result.inputs[0].setScript(</p>
<p class="p1"><span class="Apple-converted-space">    </span>bitcore.Script.empty()</p>
<p class="p1"><span class="Apple-converted-space">    </span>.add(signature.toTxFormat())</p>
<p class="p1"><span class="Apple-converted-space">    </span>.add(privateKey.toPublicKey().toBuffer())</p>
<p class="p1"><span class="Apple-converted-space">    </span>.add(redeemScript.toBuffer())</p>
<p class="p1"><span class="Apple-converted-space">  </span>);</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>return result;</p>
<p class="p1">};</p>
<p class="p2"><br></p>
<p class="p1">//trying to spend from frozen address with lower block height</p>
<p class="p1">const brokenSpendTransaction = getSpendTransaction(100, 0xffffffff);</p>
<p class="p2"><br></p>
<p class="p1">//formatting output of transactions</p>
<p class="p1">const result = {</p>
<p class="p1"><span class="Apple-converted-space">  </span>fromAddress: privateKey.toAddress().toString(),</p>
<p class="p1"><span class="Apple-converted-space">  </span>p2shAddress: p2shAddress.toString(),</p>
<p class="p1"><span class="Apple-converted-space">  </span>redeemScript: redeemScript.toString(),</p>
<p class="p1"><span class="Apple-converted-space">  </span>freezeTransaction: {</p>
<p class="p1"><span class="Apple-converted-space">    </span>txid: freezeTransaction.id,</p>
<p class="p1"><span class="Apple-converted-space">    </span>raw: freezeTransaction.serialize(true),</p>
<p class="p1"><span class="Apple-converted-space">  </span>},</p>
<p class="p1"><span class="Apple-converted-space">  </span>brokenSpendTransaction: {</p>
<p class="p1"><span class="Apple-converted-space">    </span>txid: brokenSpendTransaction.id,</p>
<p class="p1"><span class="Apple-converted-space">    </span>raw: brokenSpendTransaction.serialize(true),</p>
<p class="p1"><span class="Apple-converted-space">  </span>},</p>
<p class="p1">};</p>
<p class="p2"><br></p>
<p class="p1">console.log(JSON.stringify(result, null, 2));</p>
</body>
</html>
Ytext/html    ( F U l ~ � � � �l                           v