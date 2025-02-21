// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
import { RequestAirdrop } from "../../components/RequestAirdrop";
import pkg from "../../../package.json";
import { CandyMint } from "../../components/CandyMint";

// Store
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import Header from "components/Header";
import About from "components/About";
import Royalties from "components/Royalties";
import Marketplace from "components/NftGallery";
import MyFooter from "components/MyFooter";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="">
      <Header />
      <About />
      <Royalties />
      <Marketplace />
      <MyFooter />
    </div>
  );
};
