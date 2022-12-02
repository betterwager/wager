import * as BufferLayout from "@solana/buffer-layout";
import { Buffer } from "buffer";

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
  name,
  min_players,
  max_players,
  min_bet,
  max_bet,
  options,
  bump_seed
) {
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.seq(BufferLayout.u8(), 20, "name"),
    BufferLayout.u32("balance"),
    BufferLayout.seq(
      BufferLayout.struct([
        BufferLayout.seq(
          BufferLayout.u8(), 20, "name"), 
          BufferLayout.u16("vote_count"),
    ]), 8, "options"),
    BufferLayout.u32("min_bet"),
    BufferLayout.u32("max_bet"),
    BufferLayout.u16("min_players"),
    BufferLayout.u16("max_players"),
    BufferLayout.u16("player_count"),
    BufferLayout.u16("vote_count"),
    BufferLayout.u8("bump_seed"),
    BufferLayout.u8("state"),
  ]);
  const data = Buffer.alloc(layout.span);
  console.log(Buffer.from(options));
  layout.encode(
    {
      instruction: 0,
      name: Buffer.alloc(20, name),
      balance: 0,
      options : options,
      min_bet: min_bet,
      max_bet: max_bet,
      min_players: min_players,
      max_players: max_players,
      player_count: 0,
      vote_count: 0,
      bump_seed: bump_seed,
      state: 1,
    },
    data
  );
  console.log(data);
  return data;
}

export function JoinBetInstruction(bet_identifier) {
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.seq(BufferLayout.u8(), 20, "bet_identifier"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 1,
      bet_identifier: Buffer.alloc(20, bet_identifier),
    },
    data
  );
  console.log(data);
  return data;
}

export function MakeBetInstruction(name, option_index, playerBump, amount) {
  const layout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.seq(BufferLayout.u8(), 20, "bet_identifier"),
    BufferLayout.u8("option_index"),
    BufferLayout.u32("amount"),
    BufferLayout.u8("voted"),
    BufferLayout.u8("bump_seed"),
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 2,
      bet_identifier: Buffer.alloc(20, name),
      option_index: option_index,
      amount: amount,
      voted: 0,
      bump_seed : playerBump,
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
      option_index: option_index,
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
