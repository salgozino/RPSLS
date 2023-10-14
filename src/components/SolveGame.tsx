import { useEffect, useState } from "react";
import { GetWalletClientResult, getAccount } from "wagmi/actions";
import { Hash, PublicClient, TransactionReceipt } from "viem";
import { RPS } from "../abis/RPS";
import { Box, Button, Link, Skeleton, Typography } from "@mui/material";
import { Move } from "../lib/types";


export default function SolveGame({
  client,
  gameId,
  creator,
  walletClient,
  movePlayer2,
}: {
  client: PublicClient;
  gameId: `0x${string}`;
  balance: bigint | undefined;
  creator: `0x${string}` | undefined; 
  walletClient: GetWalletClientResult | undefined;
  movePlayer2: Move;
}) {
  const movePlayer1 = localStorage.getItem("move");
  const saltPlayer1 = localStorage.getItem("salt");

  const [hashSolve, setHashSolve] = useState<Hash>();
  const [receiptSolve, setReceiptSolve] = useState<TransactionReceipt>();

  const account = getAccount();
  console.log(account, creator)

  useEffect(() => {
    (async () => {
      if (hashSolve) {
        const receipt = await client.waitForTransactionReceipt({
          hash: hashSolve,
          timeout: 60 * 1000,
        });
        setReceiptSolve(receipt);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashSolve]);


  async function solve() {
    if (movePlayer1 && saltPlayer1 && walletClient) {
      const { request } = await client.simulateContract({
        account: account.address,
        address: gameId,
        abi: RPS.abi,
        functionName: "solve",
        args: [Number(movePlayer1), BigInt(JSON.parse(saltPlayer1))],
      });
      setHashSolve(await walletClient.writeContract(request));
    }
  }

  return (
          <>
          <Box>
            {movePlayer2 !== Move.Null ?
            <Typography>
              Time to solve the game!. Player 2 has moved with {Move[movePlayer2]}, let's discover Player1 move and solve this game
            </Typography>
            :
            <Typography>Please wait until Player 2 make it's move</Typography>
            }
            </Box>
            <Box>
            {account.address === creator ? <Button onClick={solve} variant="contained">Solve Game</Button>: `Only ${creator} can solve this game`}
            </Box>
            <Box>
            {!receiptSolve && hashSolve && (
              <Skeleton width={"50px"} height={"50px"} variant="circular" />
            )}
            {receiptSolve && (
              <Typography>
                Game Solved!. Thanks for playing!. You can go to the <Link href="/">Home Page</Link> to create a new game.
              </Typography>
            )}
            </Box>
          </>
        )
}
