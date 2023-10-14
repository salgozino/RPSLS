import React, { useState } from "react";
import { Chain } from "viem";
import { publicClient } from "../lib/wagmi";
import { RPS } from "../abis/RPS";

export default function useGameTimeout(chain: Chain, gameId: `0x${string}`) {
  const Client = publicClient({ chainId: Number(chain.id) });
  const [timeout, setTimeout] = useState<bigint>();
  const [loading, setLoading] = useState<boolean>(true);

  Client.readContract({
    address: gameId,
    abi: RPS.abi,
    functionName: "TIMEOUT",
  }).then((_timeout) => {
    setTimeout(_timeout );
    setLoading(false);
});
  return {timeout: timeout, loading: loading};
}
