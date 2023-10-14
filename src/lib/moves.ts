import Scissor from "../assets/scissors.png";
import Lizard from "../assets/lizard.png";
import Rock from "../assets/rock.png";
import Paper from "../assets/paper.png";
import Spock from "../assets/spock.png";
import { Move } from "./types";

export const moves = [
  { title: "Rock", value: Move.Rock, src: Rock },
  { title: "Paper", value: Move.Paper, src: Paper },
  { title: "Scissors", value: Move.Scissors, src: Scissor },
  { title: "Lizard", value: Move.Lizard, src: Lizard },
  { title: "Spock", value: Move.Spock, src: Spock },
];
