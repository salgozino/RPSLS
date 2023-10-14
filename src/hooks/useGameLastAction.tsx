import React, { useState } from "react";
import { Chain } from "viem";
import { publicClient } from "../lib/wagmi";
import { RPS } from "../abis/RPS";

export default function useGameLastAction(chain: Chain, gameId: `0x${string}`) {
  const Client = publicClient({ chainId: Number(chain.id) });
  const [lastAction, setLastAction] = useState<bigint>();
  const [loading, setLoading] = useState<boolean>(true);

  Client.readContract({
    address: gameId,
    abi: RPS.abi,
    functionName: "lastAction",
  }).then((_lastAction) => {
    setLastAction(_lastAction);
    setLoading(false);
});
  return {lastAction: lastAction, loading: loading};
}
