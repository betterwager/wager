import { createContext } from "react";
import Web3 from "web3";
import { Magic } from "magic-sdk";

const customNodeOptions = {
  rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
  chainId: 421613,
};

export const magic = new Magic("pk_live_7B73AD963AFECCE0", {
  network: customNodeOptions,
});

export const web3 = new Web3(magic.rpcProvider);

const FactoryABI = require("./factoryABI.json");
const FactoryAddress = "0xbd22825bef5d8A1f816e9481E27A44a084f209c5";
export const WagerFactory = new web3.eth.Contract(FactoryABI, FactoryAddress);

const WagerABI = require("./wagerABI.json");
const WagerAddress = "0xC5D3283260649D57AB68E105f88b291Ce4929285";
export const Wager = new web3.eth.Contract(WagerABI, WagerAddress);

export const AuthUserContext = createContext({});
