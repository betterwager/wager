
import { createContext } from 'react';
import Web3 from 'web3';
import { Magic } from "magic-sdk";

const customNodeOptions = {
  rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
  chainId: 421613
};

export const magic = new Magic("pk_live_7B73AD963AFECCE0", {
  network: customNodeOptions
});

export const web3 = new Web3(magic.rpcProvider);

const Factoryabi = ""
const FactoryAddress = ""
export const WagerFactory = new web3.eth.Contract(JSON.parse(Factoryabi), FactoryAddress);

const Wagerabi = ""
const WagerAddress = ""
export const Wager = new web3.eth.Contract(JSON.parse(Wagerabi), WagerAddress);

export const AuthUserContext = createContext({});