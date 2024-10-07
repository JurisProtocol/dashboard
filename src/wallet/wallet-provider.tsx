import React, { createContext, ReactNode, useEffect, useState } from "react";
import { KeplrController, WalletController, WalletName, WalletType } from "cosmes/wallet";

const WC_PROJECT_ID = "2b7d5a2da89dd74fed821d184acabf95";

const CONTROLLERS: Record<string, WalletController> = {
    [WalletName.KEPLR]: new KeplrController(WC_PROJECT_ID),
}

const CHAINS: Record<string, string> = {
    "osmosis-1": "Osmosis",
    "columbus-5": "Terra Classic",
    "stargaze-1": "Stargaze",
    "migaloo-1": "Migaloo",
};

function getRpc(chain: string): string {
    switch (chain) {
        case "osmosis-1":
            return "https://rpc.osmosis.zone";
        case "columbus-5":
            return "https://terra-classic-rpc.publicnode.com";
        case "migaloo-1":
            return "https://migaloo-rpc.polkachu.com";
        case "stargaze-1":
            return "https://stargaze-rpc.publicnode.com:443";
        default:
            throw new Error("Unknown chain");
    }
}

function getGasPrice(chain: string): { amount: string; denom: string } {
    switch (chain) {
        case "osmosis-1":
            return { amount: "0.0025", denom: getDenom(chain) };
        case "columbus-5":
            return { amount: "28.325", denom: getDenom(chain) };
        case "migaloo-1":
            return { amount: "1", denom: getDenom(chain) };
        case "stargaze-1":
            return { amount: "1.1", denom: getDenom(chain) };
        default:
            throw new Error("Unknown chain");
    }
}

function getDenom(chain: string): string {
    switch (chain) {
        case "osmosis-1":
            return "uosmo";
        case "columbus-5":
            return "uluna";
        case "migaloo-1":
            return "uwhale";
        case "stargaze-1":
            return "ustars";
        default:
            throw new Error("Unknown chain");
    }
}

// Create the context
export const WalletContext = createContext(null as any);

// Create a provider component
interface UserProviderProps {
    children: ReactNode;  // Properly type the children prop
}

// Create a provider component
export const WalletProvider: React.FC<UserProviderProps> = ({ children }) => {
    // This is the state that you want to share
    const [wallet, setWallet] = useState(WalletName.KEPLR);
    const [connected, setConnected] = useState(false);

    console.log("connected wallets:", CONTROLLERS[wallet].connectedWallets)

    // connect to all chains
    async function connect(wallet: WalletName) {
        console.log("connect", wallet);
        try {
            const chainIds = Object.keys(CHAINS);
            chainIds.forEach(async (chainId) => {
                const chainInfo = {
                    chainId,
                    rpc: getRpc(chainId),
                    gasPrice: getGasPrice(chainId)
                };
                await CONTROLLERS[wallet].connect(WalletType.EXTENSION, [chainInfo]);
            });
            setConnected(true);
        } catch (err) {
            console.error(err);
        }
    }

    async function disconnect() {
        console.log("disconnect", wallet);
        try {
            const chainIds = Object.keys(CHAINS);
            await CONTROLLERS[wallet].disconnect(chainIds);
            setConnected(false);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        // Wrap children with the provider and pass down the user state
        <WalletContext.Provider value={{
            connected,
            connect,
            disconnect,
            wallet,
            setWallet,
        }}>
            {children}
        </WalletContext.Provider>
    );
};
