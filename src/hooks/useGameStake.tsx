import { useState } from "react";
import { Chain } from "viem";
import { publicClient } from "../lib/wagmi";
import { RPS } from "../abis/RPS";

export default function useGameStake(chain: Chain, gameId: `0x${string}`) {
  const Client = publicClient({ chainId: Number(chain.id) });
  const [stake, setStake] = useState<bigint>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  Client.readContract({
    address: gameId,
    abi: RPS.abi,
    functionName: "stake",
  })
    .then((stake) => {
      setStake(stake);
      setLoading(false);
    })
    .catch((e) => {
      setError(e.message);
    });

  return { stake: stake, loading: loading, error: error };
}
