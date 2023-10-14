import { keccak256, isAddress, encodePacked } from 'viem';
import { Move } from './types';


export const validateAddress = (address : string | undefined) => address && isAddress(address);

export function hashMove(move: Move, salt: bigint) {
    return keccak256(
        encodePacked(['uint8', 'uint256'], [move, salt]),
      );
}

export function getRandomSalt(): bigint {
  // Generate a random uint256 number as a salt
  return BigInt(Math.round(Math.random() * 2**255));
}
