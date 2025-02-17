import { useEffect, useState } from "react";
import classNames from "classnames";
import Sidebar from "./Sidebar";
import { NAVIGATION } from "../constants";
import { Hamburger, WalletIcon } from "svg";
import dynamic from "next/dynamic";
import { useAutoConnect } from "contexts/AutoConnectProvider";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Navbar = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [isSidebarOpen]);
  return (
    <div>
      <div
        className={classNames("sidebar z-50", {
          open: isSidebarOpen,
          close: !isSidebarOpen,
        })}
      >
        {isSidebarOpen ? <Sidebar setSidebarOpen={setSidebarOpen} /> : null}
      </div>
      <div className="hidden sm:flex justify-between items-center container-wrap">
        <div className="flex gap-11 items-center">
          {NAVIGATION.map((navItem, index) => (
            <a
              key={index}
              href={navItem.href}
              className="text-white font-poppins text-xl hover:scale-[1.03] active:scale-[1.02] transition-all ease-linear duration-200"
            >
              {navItem.name}
            </a>
          ))}
        </div>
        <WalletMultiButtonDynamic className="mint-button border border-secondary text-white py-2 px-6 font-normal text-xl font-poppins rounded-xl flex items-center gap-2.5 cursor-pointer hover:scale-105 hover:transition-all ease-linear duration-200 active:scale-[1.02]" />
        {/* <button className="mint-button border border-secondary text-white py-2 px-6 font-normal text-xl font-poppins rounded-xl flex items-center gap-2.5 cursor-pointer hover:scale-105 hover:transition-all ease-linear duration-200 active:scale-[1.02]">
          Connect
          <WalletIcon />
        </button> */}
      </div>
      <div className="flex justify-end sm:hidden px-6">
        <Hamburger
          onClick={() => {
            setSidebarOpen(!isSidebarOpen);
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
