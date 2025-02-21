import MyFooter from "components/MyFooter";
import { NFTS } from "../constants";
import Navbar from "components/Navbar";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

const NftCard = ({ nft }: { nft: any }) => {
  return (
    <div className="w-full 2xl:w-[297px] h-[360px] xs:h-[320px] 2xl:h-[360px] border border-[#181818] backdrop-blur-2xl rounded-xl px-2.5 py-3 relative overflow-hidden">
      <img
        src={nft.image}
        alt={"dfd"}
        className="w-full rounded-[14px] object-cover"
        width={297}
        height={360}
      />

      <div className="flex justify-between items-center mt-6 mb-5 gap-2.5">
        <h4 className="text-base lg:text-lg xl:text-xl font-medium text-white">{nft.name}</h4>
        <h4 className="text-base lg:text-lg xl:text-xl font-bold text-primary">{nft.symbol}</h4>
      </div>
    </div>
  );
};

const Nfts = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const metaplex = new Metaplex(connection);
        const ownerPublicKey = new PublicKey(publicKey);

        const nftList = await metaplex.nfts().findAllByOwner({ owner: ownerPublicKey });

        const enrichedNfts = await Promise.all(
          nftList.map(async (nft) => {
            let collectionData = {
              collectionName: "Unknown Collection",
              collectionImage: null,
            };

            // Check if NFT has collection details
            if (nft.collection?.address) {
              try {
                const collectionMetadata = await metaplex.nfts().findByMint({
                  mintAddress: nft.collection.address,
                });

                collectionData.collectionName = collectionMetadata.name || "Unknown Collection";
                collectionData.collectionImage = await fetch(collectionMetadata.uri)
                  .then((res) => res.json())
                  .then((data) => data.image);
              } catch (err) {
                console.warn("Error fetching collection metadata:", err);
              }
            } else if (nft.uri) {
              // Fetch metadata from the URI
              try {
                const response = await fetch(nft.uri);
                const metadata = await response.json();
                if (metadata.collection) {
                  collectionData.collectionName = metadata.collection.name || "Unknown Collection";
                  collectionData.collectionImage = metadata.collection.image || null;
                }
              } catch (err) {
                console.warn("Error fetching metadata from URI:", err);
              }
            }

            const response = await fetch(nft.uri);
            const metadata = await response.json();

            return {
              ...nft,
              image: metadata.image,
              collectionName: collectionData.collectionName,
              collectionImage: collectionData.collectionImage,
            };
          })
        );

        setNfts(enrichedNfts);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [publicKey, connection]);

  console.log("nfts-----------------//", nfts);

  return (
    <div className="mt-6">
      <Navbar />
      <div className="container-wrap mt-16">
        <h2 className="heading mb-12 w-full max-w-[936px] text-center md:text-left uppercase">
          Digital Treasures Await:
          <br className="2xl:hidden" /> Dive Into the{" "}
          <span className="text-primary">Marketplace</span>
        </h2>
        <div>
          <div className="min-h-[950px] mb-20 max-w-[300px] xs:max-w-max mx-auto">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
              {nfts.map((nft) => {
                return <NftCard key={nft.name} nft={nft} />;
              })}
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </div>
  );
};

export default Nfts;
