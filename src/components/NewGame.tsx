import { useState, useEffect } from "react";

import { useAccount, useWalletClient } from "wagmi";
import { Hash, TransactionReceipt, isAddress, parseEther } from "viem";
import { RPS } from "../abis/RPS";
import { chains, publicClient } from "../lib/wagmi";
import { Move } from "../lib/types";
import { getRandomSalt, hashMove } from "../lib/utils";
import {
  Alert,
  Button,
  Grid,
  InputAdornment,
  Link,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { moves } from "../lib/moves";
import CopyToClipboardButton from "./CopyToClipboardButton";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

export function NewGame() {
  const chain = chains[0];
  const { data: walletClient } = useWalletClient({ chainId: chain.id });
  const account = useAccount();

  const [player2, setPlayer2] = useState<`0x${string}`>("0x0000");
  const [bet, setBet] = useState<string>("0.001");
  const [salt, setSalt] = useState<bigint | undefined>(undefined);
  const [currentMove, setCurrentMove] = useState<Move>(Move.Null);

  const [receipt, setReceipt] = useState<TransactionReceipt>();
  const [receiptError, setReceiptError] = useState<string>();
  const [txHash, setTxHash] = useState<Hash>();

  const addRecentTransaction = useAddRecentTransaction();

  useEffect(() => {
    if (currentMove) {
      localStorage.setItem("move", JSON.stringify(currentMove));
    }
  }, [currentMove]);

  useEffect(() => {
    if (salt) {
      localStorage.setItem("salt", JSON.stringify(salt.toString()));
    }
  }, [salt]);

  async function deployContract() {
    if (player2 && walletClient && currentMove !== Move.Null && account) {
      try {
        const salt = getRandomSalt();
        setSalt(salt);
        const _c1Hash = hashMove(currentMove, salt);
        const hash = await walletClient?.deployContract({
          abi: RPS.abi,
          account: account.address,
          bytecode: RPS.bytecode as `0x${string}`,
          args: [_c1Hash, player2],
          value: parseEther(bet, "wei"),
        });
        setTxHash(hash);
        addRecentTransaction({
          hash: hash,
          description: "Create game",
          confirmations: 1,
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setReceiptError(e.message);
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (txHash) {
        const receipt = await publicClient({
          chainId: chain.id,
        }).waitForTransactionReceipt({ hash: txHash });
        setReceipt(receipt);
      }
    })();
  }, [txHash, chain]);

  function isBetValid(bet: string): boolean {
    let _bet: number = 0;
    try {
      _bet = Number(bet);
    } catch {
      return false;
    }
    return _bet > 0;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={12}>
        <Typography variant={"h3"} sx={{ marginBottom: "20px" }}>
          New Game
        </Typography>
      </Grid>

      <form>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item sm={12} md={8}>
            <TextField
              error={!isAddress(player2)}
              label="Player 2"
              fullWidth={true}
              variant="outlined"
              id="player2"
              value={player2}
              type="text"
              required={true}
              helperText={"Complete with a valid ethereum address"}
              onChange={(e) => setPlayer2(e.target.value as `0x${string}`)}
            />
          </Grid>
          <Grid item alignItems="center" sm={12} md={4} justifyContent="center">
            <TextField
              error={!isBetValid(bet)}
              label="Bet"
              id="bet"
              value={Number(bet)}
              required={true}
              type="number"
              helperText="Bet has to be bigger than 0."
              onChange={(e) => setBet(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ETH</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </form>

      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        alignContent={"center"}
        textAlign={"center"}
      >
        {moves.map((move) => {
          return (
            <Grid
              item
              xs={12}
              md={2}
              container
              key={"selector-" + move.title}
              justifyContent={"center"}
            >
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
                  color={currentMove == move.value ? "success" : "error"}
                >
                  {move.title}
                </Button>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <Grid item xs={12} marginTop={"20px"} marginLeft={"10%"} width={"80%"}>
        {account &&
        account?.isConnected &&
        isAddress(player2) &&
        currentMove !== Move.Null &&
        bet !== "" &&
        Number(bet) > 0 ? (
          <>
            <Typography>
              You are going to create a game against {player2} for {bet} ETH.
              Your move is {Move[currentMove]} but will be keeped secret until
              Player2 make it's move. Press the button to create the game.
            </Typography>
            <Button
              variant="contained"
              onClick={deployContract}
              disabled={receipt !== undefined}
            >
              Create game
            </Button>
            {receipt === undefined && txHash ? (
              <>
                <Skeleton height={"50px"} width={"50px"} variant="circular" />
                Please wait while we create the game
              </>
            ) : null}
            {receipt && (
              <Alert severity="success">
                <Typography>
                  Game created! Contract Address: {receipt.contractAddress}{" "}
                </Typography>
                <Link href={`/game/${receipt.contractAddress}`}>
                  <Button variant="contained">Go to Game</Button>
                </Link>
                <CopyToClipboardButton text="Copy Contract Address to Clipboard" />
              </Alert>
            )}
            {receiptError && (
            <Alert severity="error">
              An error ocurred while performing the transaction: {receiptError}
            </Alert>
          )}
          </>
        ) : account && account?.isConnected ? (
          "Please review the input data in order to create a game. A valid address, a bet and a move are required."
        ) : (
          "Please connect your wallet to create a Game"
        )}
      </Grid>
    </Grid>
  );
}
