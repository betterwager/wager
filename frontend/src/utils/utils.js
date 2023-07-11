import * as BufferLayout from "@solana/buffer-layout";
import { Buffer } from "buffer";
import {useNavigate} from "react-router-dom"
import {Auth, API} from "aws-amplify"
import { useCallback } from "react";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { Storage } from "@aws-amplify/storage";
import  awsmobile  from "../aws-exports";
import { parseUrl } from "@aws-sdk/url-parser";



export const isPhantomInstalled = window.phantom?.solana?.isPhantom;

export const getProvider = () => {
  if ("phantom" in window) {
    // //const provider = window.phantom?.solana;
    // if (provider?.isPhantom) {
    //   //return provider;
    // }
  }

  //window.open("https://phantom.app/", "_blank");
};

export async function connect(provider) {
  try {
    const resp = await provider.connect();
    console.log(resp.publicKey.toString());
    console.log(provider.isConnected);
    // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
  } catch (err) {
    // { code: 4001, message: 'User rejected the request.' }
  }
}

export function NewWagerInstruction(
  bet_identifier,
  min_players,
  max_players,
  min_bet,
  max_bet,
  options,
  time,
  bump_seed
) {
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.seq(BufferLayout.u8(), 20, "bet_identifier"),
    BufferLayout.nu64("balance"),
    BufferLayout.seq(
      BufferLayout.struct([
        BufferLayout.seq(BufferLayout.u8(), 20, "name"),
        BufferLayout.u8("bet_count"),
        BufferLayout.u8("vote_count"),
        BufferLayout.nu64("bet_total"),
      ]),
      8,
      "options"
    ),
    BufferLayout.nu64("min_bet"),
    BufferLayout.nu64("max_bet"),
    BufferLayout.u8("min_players"),
    BufferLayout.u8("max_players"),
    BufferLayout.u8("player_count"),
    BufferLayout.nu64("time"),
    BufferLayout.u8("vote_count"),
    BufferLayout.u8("winner_index"),
    BufferLayout.u8("bump_seed"),
    BufferLayout.u8("state"),
  ]);
  const data = Buffer.alloc(layout.span);
  console.log(Buffer.from(options));
  layout.encode(
    {
      instruction: 0,
      bet_identifier: Buffer.from(bet_identifier),
      balance: 0,
      options: options,
      min_bet: min_bet,
      max_bet: max_bet,
      min_players: min_players,
      max_players: max_players,
      time: time,
      player_count: 0,
      vote_count: 0,
      winner_index: 0,
      bump_seed: bump_seed,
      state: 1,
    },
    data
  );
  console.log(data);
  return data;
}

export function JoinBetInstruction() {
  const layout = BufferLayout.struct([BufferLayout.u8("instruction")]);
  const data = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 1,
    },
    data
  );
  console.log(data);
  return data;
}

export function MakeBetInstruction(option_index, playerBump, amount) {
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.u8("option_index"),
    BufferLayout.nu64("amount"),
    BufferLayout.u8("voted"),
    BufferLayout.u8("bump_seed"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 2,
      option_index: option_index,
      amount: amount,
      voted: 0,
      bump_seed: playerBump,
    },
    data
  );
  console.log(data);
  return data;
}

export function VoteInstruction(option_index) {
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.u8("outcome"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 3,
      outcome: option_index,
    },
    data
  );
  //console.log(data);
  return data;
}

export function PayoutInstruction() {
  const layout = BufferLayout.struct([BufferLayout.u8("instruction")]);
  const data = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 4,
    },
    data
  );
  //console.log(data);
  return data;
}

export function QueryAccountInfo(option) {
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.seq(BufferLayout.u8(), 10, "option"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 2,
      option: Buffer.from(option),
    },
    data
  );
  //console.log(data);
  return data;
}

export const userLeaderCreate = async (connection) => {
  const promise = await API.graphql({
    query: mutations.createUserLeaderboard,
    variables: { input: connection },
  });
  return promise;
}
export const userCreate = async (newUser) => {
  const promise = await API.graphql({
    query: mutations.createUser,
    variables: { input: newUser },
  });
  return promise;
}
export const getUser = async (userid) => {
  const user = await API.graphql({ 
    query: queries.getUser,
    variables: {
        id: userid
    }
    });
  return user;
};

export const getUserProfilePicture = (phoneNumber) => {
  let bucket = awsmobile.aws_user_files_s3_bucket
  let region = awsmobile.aws_user_files_s3_bucket_region
  let key = encodeURIComponent(phoneNumber)
  const s3ObjectUrl = `https://${bucket}.s3.amazonaws.com/public/${key}`;
  return s3ObjectUrl
}



export const userUpdate = async (newUser) => {
  const promise = await API.graphql({
    query: mutations.updateUser,
    variables: { input: newUser },
  });
  return promise;
}

export const leaderCreate = async (newLeader) => {
  const promise = await API.graphql({
    query: mutations.createLeaderboard,
    variables: { input: newLeader },
  })
  return promise
}
export const leaderUpdate = async (newLeader) => {
  const promise = await API.graphql({
    query: mutations.updateLeaderboard,
    variables: { input: newLeader },
  });
  return promise;
}