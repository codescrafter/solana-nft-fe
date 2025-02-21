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

  console.log("nftMetadata-------------------//", nftMetadata);

  // Fetch the next available NFT's metadata and price
  const fetchNextNFTMetadata = useCallback(async () => {
    try {
      setIsLoading(true);
      const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
      // console.log("candyMachine-------------------//", candyMachine);

      // Find the next available NFT (assuming items are sequential)
      const nextItem = candyMachine.items.find((item) => !item.minted);
      // console.log("nextItem-------------------//", nextItem);

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

    debugger;

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
    <div className="">
      <h2 className="heading relative text-center mmd:text-left uppercase mb-10 flex justify-center">
        <span className="text-primary mr-2 inline-block">Mint </span> Now
      </h2>
      {nftMetadata && (
        <div className="w-full p-6  max-w-[1120px] mx-auto bg-[#2C2C2C38] border  border-[##FFFFFF0D] rounded-[20px] shadow-xl flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="max-w-[462px] h-[300px] md:h-[539px]">
            <img
              src={nftMetadata.image}
              alt={nftMetadata.name}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="text-white">
            <table className="table-auto w-full border-collapse">
              <tbody>
                {[
                  { label: "Creator", value: nftMetadata?.name },
                  { label: "Description", value: nftMetadata?.description },
                  { label: "Price", value: nftPrice ? `${nftPrice.toLocaleString()} SOL` : "N/A" },
                  { label: "Balance", value: `${(balance || 0).toLocaleString()} SOL` },
                  { label: "Symbol", value: nftMetadata?.symbol },
                  { label: "Seller Points", value: nftMetadata?.sellerFeeBasisPoints },
                ].map((item, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="font-semibold py-2 lg:py-3 px-4">{item.label}:</td>
                    <td className="py-2 px-4">{item.value || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-5 items-center mt-1">
              <p className="mt-4 text-sm font-semibold">Attributes:</p>
              {nftMetadata?.attributes?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {nftMetadata.attributes.map((attr, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium bg-gray-800 border border-gray-700 rounded-lg"
                    >
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              className="mint-button w-full mt-6 py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              onClick={onClick}
              disabled={isLoading || !nftMetadata}
            >
              {isLoading ? "Loading..." : `Mint NFT (${nftPrice || "N/A"} SOL)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
