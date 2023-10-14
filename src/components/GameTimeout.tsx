import { useEffect, useState } from "react";
import { Hash, PublicClient, TransactionReceipt } from "viem";
import { GetWalletClientResult, getAccount } from "wagmi/actions";
import { RPS } from "../abis/RPS";
import { Button, Skeleton, Typography } from "@mui/material";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export default function GameTimeout({
  client,
  gameId,
  creator,
  player2,
  walletClient,
  lastAction,
  timeout,
  now,
  player,
}: {
  client: PublicClient;
  gameId: `0x${string}`;
  creator?: `0x${string}`;
  player2?: `0x${string}`;
  lastAction: bigint;
  timeout: bigint;
  now: number;
  walletClient: GetWalletClientResult | undefined;
  player: "Player1" | "Player2";
}) {
  const [hashTimeout, setHashTimeout] = useState<Hash>();
  const [receiptTimeout, setReceiptTimeout] = useState<TransactionReceipt>();
  const account = getAccount();

  const addRecentTransaction = useAddRecentTransaction();

  const isTimeout = lastAction + timeout < now;


  useEffect(() => {
    (async () => {
      if (hashTimeout) {
        const receipt = await client.waitForTransactionReceipt({
          hash: hashTimeout,
          timeout: 60 * 1000,
        });
        setReceiptTimeout(receipt);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashTimeout]);

  async function Timeout() {
    if (
      account &&
      player2 &&
      account.address == player2 &&
      gameId &&
      lastAction &&
      timeout &&
      walletClient &&
      lastAction + timeout < now
    ) {
      const { request } = await client.simulateContract({
        account: account.address,
        address: gameId,
        abi: RPS.abi,
        functionName: player === "Player1" ? "j1Timeout" : "j2Timeout",
      });
      const _hash = await walletClient.writeContract(request);
      
      setHashTimeout(_hash);
      addRecentTransaction({
        hash: _hash,
        description: `Timeout ${player}`,
        confirmations: 1
      })
    }
  }

  return (
    <>
      {isTimeout ? (
        player === "Player1" ? (
          account.address === player2 ?
          <Typography>Hurry!, we are in overtime!, player 1 can call timeout function! </Typography>
          :
          <Typography>
            Player2 has not made her move!. It's time to recover the stake!
          </Typography>
        ) :
        ( account.address == creator ?
          <Typography>Hurry!, we are in overtime!, player 2 can call the timeout function!</Typography>
          :
          <Typography>
            Player 1 has not solved the game!. It's time to close the game by
            timeout!
          </Typography>
        )
      ) : null}

      {player === "Player2" && player2 === account.address && isTimeout && (
        <Button onClick={Timeout} variant="contained">
          Solve Game by Timeout
        </Button>
      )}
      {player === "Player1" && creator === account.address && isTimeout && (
        <Button onClick={Timeout} variant="contained">
          Solve Game by Timeout
        </Button>
      )}
      {account.address !== creator && account.address !== player2 && isTimeout && (
        <Typography>Only {player == "Player1" ? creator : player2} can call the Timeout function. If you are the owner of this wallet, please connect with it.</Typography>
      )}
      {!receiptTimeout && hashTimeout && (
        <Skeleton width={"50px"} height={"50px"} variant="circular" />
      )}
      {receiptTimeout && (
        <Typography>
          Done!, you have received all the money at stake!.
        </Typography>
      )}
    </>
  );
}
