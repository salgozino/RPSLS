import { useEffect, useState } from "react";
import { GetWalletClientResult, getAccount } from "wagmi/actions";
import { Hash, PublicClient, TransactionReceipt } from "viem";
import { RPS } from "../abis/RPS";
import { Alert, Box, Button, Link, Skeleton, Typography } from "@mui/material";
import { Move } from "../lib/types";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export default function SolveGame({
  client,
  gameId,
  walletClient,
  movePlayer2,
}: {
  client: PublicClient;
  gameId: `0x${string}`;
  balance: bigint | undefined;
  walletClient: GetWalletClientResult | undefined;
  movePlayer2: Move;
}) {
  const movePlayer1 = localStorage.getItem("move");
  const saltPlayer1 = localStorage.getItem("salt");

  const [hashSolve, setHashSolve] = useState<Hash>();
  const [receiptSolve, setReceiptSolve] = useState<TransactionReceipt>();
  const [receiptError, setReceiptError] = useState<string>();

  const account = getAccount();

  const addRecentTransaction = useAddRecentTransaction();

  useEffect(() => {
    (async () => {
      if (hashSolve) {
        try {
          const receipt = await client.waitForTransactionReceipt({
            hash: hashSolve,
            timeout: 60 * 1000,
          });
          setReceiptSolve(receipt);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setReceiptError(e.message);
        }
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
      const _hash = await walletClient.writeContract(request);
      setHashSolve(_hash);
      addRecentTransaction({
        hash: _hash,
        description: "Solve",
        confirmations: 1,
      });
    }
  }

  return (
    <>
      <Box>
        {movePlayer2 !== Move.Null ? (
          <Typography>
            Time to solve the game!. Player 2 has moved with {Move[movePlayer2]}
            , let's discover Player1 move and solve this game
          </Typography>
        ) : (
          <Typography>Please wait until Player 2 make it's move</Typography>
        )}
      </Box>

      <Box>
        <Button
          onClick={solve}
          variant="contained"
          disabled={movePlayer2 === Move.Null}
        >
          Solve Game
        </Button>
      </Box>

      <Box>
        {!receiptSolve && hashSolve && (
          <Skeleton width={"50px"} height={"50px"} variant="circular" />
        )}
        {receiptSolve && (
          <Alert severity="success">
            Game Solved!. Thanks for playing!. You can go to the{" "}
            <Link href="/">Home Page</Link> to create a new game.
          </Alert>
        )}
        {receiptError && (
          <Alert severity="error">
            An error ocurred while performing the transaction: {receiptError}
          </Alert>
        )}
      </Box>
    </>
  );
}
