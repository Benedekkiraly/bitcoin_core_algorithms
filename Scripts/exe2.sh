#!/bin/bash


REGTEST_DIR=~/.bitcoin;
BITCOIN_D=~/Bitcoin/bitcoin-0.20.1/bin/bitcoind;
BITCOIN_CLI=~/Bitcoin/bitcoin-0.20.1/bin/bitcoin-cli;

ADDRESS_A=$($BITCOIN_CLI -regtest getnewaddress "A");
ADDRESS_B=$($BITCOIN_CLI -regtest getnewaddress "B");
echo "Address A= " $ADDRESS_A;
echo "Address B= " $ADDRESS_B;
echo "Generating blocks!";
$BITCOIN_CLI -regtest generatetoaddress 101 $ADDRESS_A;
#Block generation needs 100 confirmations to be spendable on Bitcoin Testnet
UNSPENT=$($BITCOIN_CLI -regtest listunspent 6 9999 [\"$ADDRESS_A\"]);
TXID=$(echo  $UNSPENT | jq '.[].txid');
VOUT=$(echo  $UNSPENT | jq '.[].vout');
SCRIPTPUBKEY=$(echo  $UNSPENT | jq '.[].scriptPubKey');
SCRIPTSIG=$(echo  $UNSPENT | jq '.[].scriptSig');
echo "TXID IS:"
echo $TXID
echo "VOUT IS:"
echo $VOUT
echo "SCRIPTPUBKEY IS:"
echo  $SCRIPTPUBKEY
echo "SCRIPTSIG IS:"
echo  $SCRIPTSIG