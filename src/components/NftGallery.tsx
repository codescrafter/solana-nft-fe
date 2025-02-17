import classNames from "classnames";
import { NFT_CATEGORIES, NFTS } from "../constants";
import { useState } from "react";
import { NftCategoryTypes, NftTypes } from "types";
import Image from "next/image";
import { CandyMint } from "./CandyMint";
import useUserSOLBalanceStore from "stores/useUserSOLBalanceStore";
import { useWallet } from "@solana/wallet-adapter-react";

const Marketplace = () => {
  const wallet = useWallet();
  const balance = useUserSOLBalanceStore((s) => s.balance);

  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [selectedCategoryAddress, setSelectedCategoryAddress] = useState<string>(
    NFT_CATEGORIES[1].address
  );
  return (
    <div id="nft-gallery" className="relative">
      <Image
        src="/images/left-gradient.webp"
        alt="left gradient"
        width={100}
        height={500}
        className="object-contain h-full absolute left-0 top-0 hidden lg:block"
      />
      <Image
        src="/images/right-gradient.webp"
        alt="right gradient"
        width={100}
        height={500}
        className="object-contain h-full absolute right-0 top-0 hidden lg:block"
      />

      <div className="container-wrap mt-[113px] relative z-10">
        <div className="flex flex-col mt-2">
          <CandyMint />
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
            {wallet && (
              <div className="flex flex-row justify-center">
                <div>{(balance || 0).toLocaleString()}</div>
                <div className="text-slate-600 ml-2">SOL</div>
              </div>
            )}
          </h4>
        </div>
        <div>
          <h2 className="heading mb-12 w-full max-w-[936px] text-center md:text-left uppercase">
            Digital Treasures Await:
            <br className="2xl:hidden" /> Dive Into the{" "}
            <span className="text-primary">Marketplace</span>
          </h2>
          <div>
            <div className="flex gap-4 items-center flex-wrap mb-12">
              {NFT_CATEGORIES.map((category: NftCategoryTypes) => (
                <button
                  key={category.address}
                  className={classNames(
                    "text-white border border-white h-10 min-w-28 px-4 hover:scale-105 hover:transition-all ease-linear duration-200 active:scale-[1.03] rounded-lg cursor-pointer",
                    category.address === selectedCategoryAddress
                      ? "bg-[#FF770038] !border-primary"
                      : "bg-transparent"
                  )}
                  onClick={() => setSelectedCategoryAddress(category.address)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="min-h-[950px] mb-20 max-w-[300px] xs:max-w-max mx-auto">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                {NFTS.map((nft) => {
                  // if (nft.address !== selectedCategoryAddress) return null;
                  return (
                    <NftCard
                      key={nft.address}
                      nft={nft}
                      isActive={activeCard === nft.address}
                      setActiveCard={setActiveCard}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

type NftCardProps = {
  nft: NftTypes;
  isActive: boolean;
  setActiveCard: (id: string | null) => void;
};

const NftCard = ({ nft, isActive, setActiveCard }: NftCardProps) => {
  return (
    <div
      className="w-full 2xl:w-[297px] h-[406px] xs:h-[340px] 2xl:h-[406px] border border-[#181818] backdrop-blur-2xl rounded-xl px-2.5 py-3 group relative overflow-hidden"
      onClick={() => setActiveCard(isActive ? null : nft.address)}
    >
      <img
        src={nft.nftImage}
        alt="NFT Image"
        className={`w-full rounded-[14px] object-cover transition-all duration-500 ease-in-out 
        ${
          isActive ? "h-[270px] xs:h-[215px] 2xl:h-[270px]" : "h-[315px] xs:h-[250px] 2xl:h-[315px]"
        } 
        group-hover:h-[270px] xs:group-hover:h-[215px] 2xl:group-hover:h-[270px]`}
      />

      <div
        className="flex justify-between items-center mt-6 mb-5 gap-2.5 
        transition-all duration-500 ease-in-out 
        group-hover:mt-3"
      >
        <h4 className="text-base lg:text-lg xl:text-xl font-medium text-white">{nft.name}</h4>
        <h4 className="text-base lg:text-lg xl:text-xl font-bold text-primary">{nft.price}</h4>
      </div>

      <div className="absolute bottom-3 left-0 w-full flex justify-center">
        <button
          className={`mint-button border w-[90%] border-secondary text-white py-2 px-6 font-semibold text-base lg:text-xl font-poppins rounded-xl flex items-center justify-center gap-2.5 cursor-pointer 
          transition-all duration-500 ease-in-out transform 
          ${isActive || "group-hover:translate-y-0 group-hover:opacity-100"} 
          ${isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          Mint Now
        </button>
      </div>
    </div>
  );
};
