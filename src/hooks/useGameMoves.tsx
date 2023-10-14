import React, { useState } from "react";
import { Chain } from "viem";
import { publicClient } from "../lib/wagmi";
import { RPS } from "../abis/RPS";
import { Move } from "../lib/types";

export default function useGameMovePlayer2(chain: Chain, gameId: `0x${string}`) {
  const Client = publicClient({ chainId: Number(chain.id) });
  const [movePlayer2, setMovePlayer2] = useState<Move>();
  const [loading, setLoading] = useState<boolean>(true);

  Client.readContract({
    address: gameId,
    abi: RPS.abi,
    functionName: "c2",
  }).then((c2) => {
    setMovePlayer2(c2);
    setLoading(false);
});
  return {movePlayer2: movePlayer2, loading: loading};
}
