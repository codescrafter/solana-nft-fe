import { useRouter } from "next/navigation";
import { NAVIGATION } from "../constants";
import { CrossIcon, WalletIcon } from "../svg";
import { WalletMultiButtonDynamic } from "./Navbar";

type SidebarProps = {
  setSidebarOpen: (open: boolean) => void;
};

const Sidebar = ({ setSidebarOpen }: SidebarProps) => {
  const router = useRouter();

  const handleNavigation = (href) => {
    if (href.startsWith("#")) {
      // Section Navigation
      const section = document.querySelector(href);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Page Navigation
      router.push(href);
    }
  };
  return (
    <div className="mt-4 max-h-[80vh] overflow-y-auto scrollbar relative z-10">
      <div className="flex justify-end items-center px-4 mb-8">
        {/* <img src="/logo.svg" className="w-14 h-14 object-contain" /> */}
        <button className="button-click inline-flex h-8 w-8 items-center bg-orange rounded border border-dark-brown">
          <CrossIcon
            onClick={() => {
              setSidebarOpen(false);
            }}
          />
        </button>
      </div>
      <ul className="flex flex-col p-4 h-[80vh]">
        {NAVIGATION.map((navItem) => (
          <button
            key={navItem.name}
            className="font-michroma mb-4 text-base text-white pb-4 border-b-[0.5px] border-[#ebdbd2] cursor-pointer text-start"
            onClick={() => {
              handleNavigation(navItem.href);
              setSidebarOpen(false);
            }}
          >
            {navItem.name}
          </button>
        ))}
        <WalletMultiButtonDynamic className="mint-button border border-secondary text-white py-2 px-6 font-normal text-xl font-poppins rounded-xl flex items-center gap-2.5 cursor-pointer hover:scale-105 hover:transition-all ease-linear duration-200 active:scale-[1.02]" />
      </ul>
    </div>
  );
};

export default Sidebar;
