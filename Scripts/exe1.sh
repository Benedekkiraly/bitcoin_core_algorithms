#!/bin/bash


REGTEST_DIR=~/.bitcoin;
BITCOIN_D=~/Bitcoin/bitcoin-0.20.1/bin/bitcoind;
BITCOIN_CLI=~/Bitcoin/bitcoin-0.20.1/bin/bitcoin-cli;

ADDRESS_A=$($BITCOIN_CLI -regtest getnewaddress "A");
ADDRESS_B=$($BITCOIN_CLI -regtest getnewaddress "B");
echo "Address A= " $ADDRESS_A;
echo "Address B= " $ADDRESS_B;
echo "Generating blocks!"
$BITCOIN_CLI -regtest generatetoaddress 100 $ADDRESS_A;
$BITCOIN_CLI -regtest generatetoaddress 1 $ADDRESS_A;
#Block generation needs 100 confirmations to be spendable on Bitcoin Testnet
echo "Sending BTC to Address B!";
$BITCOIN_CLI -regtest sendtoaddress $ADDRESS_B 10.00;
echo "BTC sent!";
$BITCOIN_CLI -regtest listaddressgroupings;
echo "We can see, that A has 0 while B has 10 BTC funds!"
echo "Task done!";

