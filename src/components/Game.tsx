import { useParams } from "react-router-dom";
import { Move } from "../lib/types";
import { Grid, Link, Skeleton, Typography } from "@mui/material";
import { useWalletClient } from "wagmi";
import { chains, publicClient } from "../lib/wagmi";
import useGameStake from "../hooks/useGameStake";
import { formatEther } from "viem";
import { getAccount } from "wagmi/actions";
import useGameCreator from "../hooks/useGameCreator";
import useGamePlayer2 from "../hooks/useGamePlayer2";
import useGameMovePlayer2 from "../hooks/useGameMoves";
import useGameTimeout from "../hooks/useGameTimeout";
import useGameLastAction from "../hooks/useGameLastAction";
import useGameBalance from "../hooks/useGameBalace";
import PlayMove from "../components/PlayMove";
import SolveGame from "../components/SolveGame";
import GameTimeout from "../components/GameTimeout";
import { useEffect, useState } from "react";
import CopyToClipboardButton from "./CopyToClipboardButton";

export function Game() {
  const { gameId: _gameId } = useParams();
  const gameId = _gameId as `0x${string}`;

  const chain = chains[0];
  const Client = publicClient({ chainId: Number(chain.id) });
  const account = getAccount();
  const { data: walletClient } = useWalletClient({ chainId: chain.id });
  const {
    stake,
    loading: loadingStake,
    error: stakeError,
  } = useGameStake(chain, gameId);
  const {
    creator,
    loading: loadingCreator,
    error: creatorError,
  } = useGameCreator(chain, gameId);
  const { player: player2 } = useGamePlayer2(chain, gameId);
  const { movePlayer2 } = useGameMovePlayer2(chain, gameId);
  const { timeout } = useGameTimeout(chain, gameId);
  const { lastAction } = useGameLastAction(chain, gameId);
  const { balance } = useGameBalance(chain, gameId);

  const isValidGame =
    !loadingCreator && !loadingStake
      ? stakeError === undefined && creatorError === undefined
      : undefined;
  const [deltaMinutes, setDeltaMinutes] = useState<number>();
  const [now, setNow] = useState<number>(Date.now() / 1000);

  useEffect(() => {
    if (lastAction && timeout) {
      if (deltaMinutes && deltaMinutes > 0) {
        // avoid calling the counter if we are beyond timeout
        return;
      }
      const interval = setInterval(() => {
        const _now = Date.now() / 1000;

        const delta = _now - Number(lastAction + timeout);
        setDeltaMinutes(delta / 60);

        setNow(_now);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastAction, timeout, deltaMinutes]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item sm={10}>
          <Typography variant="h4" marginBottom="20px">
            Let's Play{" "}
            <a
              href={`https://goerli.etherscan.io/address/${gameId}`}
              target="_blank"
            >
              {gameId.slice(0, 6)}...{gameId.slice(-4)}
            </a>
          </Typography>
        </Grid>
        <Grid item sm={2}>
          <CopyToClipboardButton text="Share Game" />
        </Grid>
      </Grid>
      {isValidGame === true && (
        <>
          <Grid container marginBottom="20px">
            <Grid item sm={12} md={6}>
              <Typography>
                Game Balance:{" "}
                {balance !== undefined ? (
                  `${formatEther(balance)} ETH`
                ) : (
                  <Skeleton variant="circular" width={"50px"} height={"50px"} />
                )}
              </Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography>
                Game Open until:
                {deltaMinutes !== undefined ? (
                  deltaMinutes > 0 ? (
                    balance && balance > 0 ? (
                      "The timeout function can be called!"
                    ) : (
                      "Game closed"
                    )
                  ) : (
                    `The Game is opend for the next ${-Math.floor(
                      deltaMinutes
                    )} minutes and ${-Math.floor(
                      -(deltaMinutes - Math.floor(deltaMinutes)) * 60
                    )} seconds`
                  )
                ) : (
                  <Skeleton variant="circular" width={"50px"} height={"50px"} />
                )}
              </Typography>
            </Grid>
            {balance === BigInt(0) && (
              <Typography>This game has finished!</Typography>
            )}
          </Grid>

          {/* Player 2 Move */}
          {account &&
            player2 &&
            account.address === player2 &&
            stake &&
            balance &&
            balance > BigInt(0) &&
            movePlayer2 === Move.Null && (
              <PlayMove
                client={Client}
                walletClient={walletClient}
                gameId={gameId}
                stake={stake}
              />
            )}
          {account &&
            player2 &&
            account.address !== player2 &&
            creator &&
            account.address !== creator && (
              <Typography>
                Only {player2} or {creator} can play this game 😭. Go the the{" "}
                <Link href="/">Home Page</Link> and create a new game!
              </Typography>
            )}

          {/* Creator solve the game */}
          {account &&
            creator &&
            balance &&
            balance > BigInt(0) &&
            account.address === creator &&
            movePlayer2 !== undefined && (
              <SolveGame
                client={Client}
                walletClient={walletClient}
                gameId={gameId}
                balance={balance}
                movePlayer2={movePlayer2}
              />
            )}
          {/* Timeout */}
          {account &&
            (account.address === creator || account.address === player2) && // only can be called by Player 1 or 2
            lastAction &&
            timeout &&
            movePlayer2 !== undefined &&
            now > lastAction + timeout &&
            balance &&
            balance > 0 && (
              <GameTimeout
                client={Client}
                walletClient={walletClient}
                gameId={gameId}
                creator={creator}
                player2={player2}
                player={movePlayer2 !== Move.Null ? "Player2" : "Player1"}
                lastAction={lastAction}
                now={now}
                timeout={timeout}
              />
            )}
        </>
      )}
      {isValidGame === false && <Typography>This is not a valid game!</Typography>}
    </>
  );
}
