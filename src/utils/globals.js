
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import { createContext } from 'react';

const rpcUrl = "https://api.devnet.solana.com";

export const magic = new Magic("pk_live_7B73AD963AFECCE0", {
  extensions: {
    solana: new SolanaExtension({
      rpcUrl
    })
  }
});


export const AuthUserContext = createContext({});