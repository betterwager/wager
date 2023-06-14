import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Auth} from 'aws-amplify';
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import awsExports from "./aws-exports.js";

const rpcUrl = "https://api.devnet.solana.com";

const magic = new Magic("pk_live_7B73AD963AFECCE0", {
  extensions: {
    solana: new SolanaExtension({
      rpcUrl
    })
  }
});

async function refreshToken() {
  const didToken = await magic.user.getIdToken();
  const userMetadata = await magic.user.getMetadata();
  const body = JSON.stringify({
    didToken,
    issuer: userMetadata.issuer,
  });
  const res = await fetch(
    `${awsExports.aws_cloud_logic_custom[0].endpoint}/auth`,
    {
      method: "POST",
      body,
    }
  );
  const json = await res.json();
  return {
    identity_id: json.IdentityId,
    token: json.Token,
    expires_at: 3600 * 1000 + new Date().getTime(),
  };
}

Auth.configure({
  refreshHandlers: {
    developer: refreshToken,
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
