import { useState } from "react";
import { Chain } from "viem";
import { publicClient } from "../lib/wagmi";
import { RPS } from "../abis/RPS";

export default function useGameCreator(chain: Chain, gameId: `0x${string}`) {
  const Client = publicClient({ chainId: Number(chain.id) });
  const [creator, setCreator] = useState<`0x${string}`>();
  const [loading, setLoading] = useState<boolean>(true);

  Client.readContract({
    address: gameId,
    abi: RPS.abi,
    functionName: "j1",
  }).then((j1) => {
    setCreator(j1);
    setLoading(false);
});
  return {creator: creator, loading: loading};
}
