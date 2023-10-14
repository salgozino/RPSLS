import React, { useState } from "react";
import { Chain } from "viem";
import { publicClient } from "../lib/wagmi";
import { getBalance } from "viem/actions";

export default function useGameBalance(chain: Chain, gameId: `0x${string}`) {
  const Client = publicClient({ chainId: Number(chain.id) });
  const [balance, setBalance] = useState<bigint|undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchBalance() {
    const _balance = await getBalance(Client, {address: gameId})
    setBalance(_balance);
    setLoading(false);
  }

  if (balance === undefined) {
    fetchBalance()
  }
  return {balance: balance, loading: loading};
}
