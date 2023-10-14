import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import {
  goerli
} from 'wagmi/chains';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

export const { chains, publicClient } = configureChains(
    [goerli],
    [
      // infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY! }),
      jsonRpcProvider({
        rpc: () => ({
          http: 'https://ethereum-goerli.publicnode.com',
        }),
      }),
      publicProvider()
    ]
  );
  
export const { connectors } = getDefaultWallets({
    appName: 'RPSLS',
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    chains
  });
  
export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })