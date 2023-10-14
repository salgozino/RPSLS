import { useState } from "react";
import { Chain } from "viem";
import { publicClient } from "../lib/wagmi";
import { RPS } from "../abis/RPS";

export default function useGamePlayer2(chain: Chain, gameId: `0x${string}`) {
  const Client = publicClient({ chainId: Number(chain.id) });
  const [player, setPlayer] = useState<`0x${string}`>();
  const [loading, setLoading] = useState<boolean>(true);

  Client.readContract({
    address: gameId,
    abi: RPS.abi,
    functionName: "j2",
  }).then((j2) => {
    setPlayer(j2);
    setLoading(false);
});
  return {player: player, loading: loading};
}
