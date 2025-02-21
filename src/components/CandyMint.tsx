import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useMemo, useState, useEffect } from "react";
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, transactionBuilder, publicKey, some } from "@metaplex-foundation/umi";
import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { LAMPORTS_PER_SOL, TransactionSignature, clusterApiUrl } from "@solana/web3.js";

const quicknodeEndpoint = process.env.NEXT_PUBLIC_RPC || clusterApiUrl("devnet");
const candyMachineAddress = publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
const treasury = publicKey(process.env.NEXT_PUBLIC_TREASURY);

export const CandyMint: FC = () => {
  const { connection } = useConnection();
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [nftMetadata, setNftMetadata] = useState(null); // State to store NFT metadata
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state
  const [nftPrice, setNftPrice] = useState(null); // State to store NFT price
  const wallet = useWallet();
  const balance = useUserSOLBalanceStore((s) => s.balance);

  const umi = useMemo(
    () =>
      createUmi(quicknodeEndpoint)
        .use(walletAdapterIdentity(wallet))
        .use(mplCandyMachine())
        .use(mplTokenMetadata()),
    [wallet]
  );

  // Fetch the next available NFT's metadata and price
  const fetchNextNFTMetadata = useCallback(async () => {
    try {
      setIsLoading(true);
      const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);

      // Find the next available NFT (assuming items are sequential)
      const nextItem = candyMachine.items.find((item) => !item.minted);

      if (nextItem) {
        // Fetch the metadata JSON from the URI
        const response = await fetch(nextItem.uri);
        const metadata = await response.json();
        setNftMetadata(metadata);
      } else {
        setNftMetadata(null); // No available NFTs
      }

      // Fetch NFT price from Candy Guard
      const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
      if (candyGuard && candyGuard) {
        setNftPrice(
          candyGuard?.guards.solPayment.value.lamports.basisPoints.toString() / 1000000000
        );
      }
    } catch (error) {
      console.error("Failed to fetch NFT metadata:", error);
      notify({
        type: "error",
        message: "Failed to fetch NFT metadata",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [umi, candyMachineAddress]);

  // Fetch metadata when the component mounts or the wallet changes
  useEffect(() => {
    if (wallet.publicKey) {
      fetchNextNFTMetadata();
    }
  }, [wallet.publicKey, fetchNextNFTMetadata]);

  const onClick = useCallback(async () => {
    if (!wallet.publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }

    // Fetch the Candy Machine.
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    // Fetch the Candy Guard.
    const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
    try {
      // Mint from the Candy Machine.
      const nftMint = generateSigner(umi);
      const transaction = await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            candyGuard: candyGuard?.publicKey,
            nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            mintArgs: {
              solPayment: some({ destination: treasury }),
            },
          })
        );
      const { signature } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });
      notify({ type: "success", message: "Mint successful!" });

      // Refresh the metadata after minting
      fetchNextNFTMetadata();
      getUserSOLBalance(wallet.publicKey, connection);
    } catch (error: any) {
      notify({
        type: "error",
        message: `Error minting!`,
        description: error?.message,
      });
      console.log("error", `Mint failed! ${error?.message}`);
    }
  }, [
    wallet,
    connection,
    getUserSOLBalance,
    umi,
    candyMachineAddress,
    treasury,
    fetchNextNFTMetadata,
  ]);

  return (
    <div className="flex flex-col items-center justify-center p-6 mb-20">
      <h2 className="heading relative text-center mmd:text-left uppercase mb-10">
        <span className="text-primary">Mint</span> <br className="mmd:hidden" /> Now
      </h2>
      {nftMetadata && (
        <div className="max-w-lg w-full p-6 border rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">{nftMetadata.name}</h2>
          <img
            src={nftMetadata.image}
            alt={nftMetadata.name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          <p className="mt-4 text-center">{nftMetadata.description}</p>
          <div className="flex justify-between">
            {nftMetadata.attributes && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Attributes:</h3>
                <ul className="grid grid-cols-2 gap-3 mb-4">
                  {nftMetadata.attributes.map((attr, index) => (
                    <li key={index} className="p-2 border rounded-lg">
                      <span className="font-semibold">{attr.trait_type}:</span> {attr.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* {nftPrice && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Price:</h3>
                <div className="flex flex-row justify-center">
                  <div>{nftPrice.toLocaleString()}</div>
                  <div className="text-slate-600 ml-2">SOL</div>
                </div>
              </div>
            )} */}
            {wallet && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Balance:</h3>
                <div className="flex flex-row justify-center">
                  <div>{(balance || 0).toLocaleString()}</div>
                  <div className="text-slate-600 ml-2">SOL</div>
                </div>
              </div>
            )}
          </div>
          <button
            className="mint-button border w-[160px] border-secondary text-white py-2 px-6 font-semibold text-xl font-poppins rounded-xl flex items-center gap-2.5 cursor-pointer hover:scale-105 hover:transition-all ease-linear duration-200 active:scale-[1.02] mt-2 mmd:mt-0 flex justify-center w-full"
            onClick={onClick}
            disabled={isLoading || !nftMetadata}
          >
            {isLoading ? "Loading..." : `Mint NFT (${nftPrice} SOL)`}
          </button>
        </div>
      )}
    </div>
  );
};
