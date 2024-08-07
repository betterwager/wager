//React Imports
import { React, useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Styling Imports
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@aws-amplify/ui-react/styles.css";
import { ChakraProvider } from "@chakra-ui/react";
import { standardStyling } from "./theme";

//Web3 Imports
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { GlowWalletAdapter, PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

//Cloud Imports
import awsExports from "./aws-exports.js";
import { Amplify, Auth } from "aws-amplify";

//Internal Imports
import Dashboard from "./views/Dashboard.js";
import Home from "./views/Home.js";
import Leaderboard from "./views/Leaderboard.js";
import Callback from "./components/Callback.js";
import SignInMagic from "./components/SignInMagic";

Amplify.configure(awsExports);

export var HOME = "/";
export var DASHBOARD = "/Dashboard";
export var LOGIN = "/login";
export var SIGNUP = "/signup";
export var LEADERBOARD = "/Leaderboard";
export var CALLBACK = "/callback";

function App() {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/solana-labs/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
    ],
    []
  );

  

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ChakraProvider theme={standardStyling}>
            <Router>
              <Routes>
                <Route exact path={HOME} element={<Home />} />
                <Route exact path={DASHBOARD} element= {<Dashboard  />} />
                <Route exact path={LEADERBOARD} element={<Leaderboard/>} />
                <Route exact path={LOGIN} element={<SignInMagic />} />
              </Routes>
            </Router>
          </ChakraProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
