import { useEffect, useState } from "react";
import { Hash, PublicClient, TransactionReceipt, formatEther} from "viem";
import { Move } from "../lib/types";
import { RPS } from "../abis/RPS";
import { Button, Grid, Skeleton, Typography } from "@mui/material";
import { moves } from "../lib/moves";
import { useAccount } from "wagmi";
import { GetWalletClientResult } from "wagmi/actions";

export default function PlayMove({
  client,
  gameId,
  walletClient,
  stake
}: {
  client: PublicClient;
  gameId: `0x${string}`;
  walletClient: GetWalletClientResult | undefined;
  stake: bigint;
}) {
  const [hashMove, setHashMove] = useState<Hash>();
  const [receiptMove, setReceiptMove] = useState<TransactionReceipt>();
  const [currentMove, setCurrentMove] = useState<Move>(Move.Null);

  const account = useAccount();

  useEffect(() => {
    (async () => {
      if (hashMove) {
        const receipt = await client.waitForTransactionReceipt({
          hash: hashMove,
          timeout: 60 * 1000,
        });
        setReceiptMove(receipt);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashMove]);

  async function play() {
    if (
      account &&
      gameId &&
      currentMove !== Move.Null &&
      stake !== undefined &&
      walletClient
    ) {
      const { request } = await client.simulateContract({
        account: account.address,
        address: gameId,
        abi: RPS.abi,
        functionName: "play",
        args: [currentMove],
        value: stake,
      });

      setHashMove(await walletClient.writeContract(request));
    }
  }
  return (
          <>
            <Typography variant="h5">Choose your move:</Typography>
            <Grid container marginBottom={'20px'}>
              {moves.map((move) => {
                return (
                  <Grid item xs={2} container key={"selector-" + move.title}>
                    <Grid item xs={12}>
                      <img src={move.src} width={"100px"} height={"100px"} />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        onClick={() => {
                          // If click again same button, define move as Null
                          setCurrentMove(
                            currentMove == move.value ? Move.Null : move.value
                          );
                        }}
                        variant="contained"
                        color={
                          currentMove == move.value ? "success" : "error"
                        }
                      >
                        {move.title}
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
            {account.isConnected && stake && currentMove !== Move.Null ? (
              <>
              {/* TODO: Check if user has the balance to stake */}
                <Button onClick={play} variant='contained' disabled={receiptMove !== undefined}>
                  Send Move ({formatEther(stake)} ETH)
                </Button>
                {!receiptMove && hashMove && (
                  <>
                    <Skeleton width={"50px"} height={"50px"} /> Please wait
                    while the move is performed...
                  </>
                )}
                {receiptMove && (
                  <>
                    Move performed!. Please let the game creator know to solve
                    the game.
                  </>
                )}
              </>
            ) : 
            account.isConnected
            ? <Typography>Please select your move</Typography>
            :(
              <Typography>Please connect to deploy the contract</Typography>
            )}
          </>
  );
}
