import { NAVIGATION } from "../constants";
import { CrossIcon, WalletIcon } from "../svg";

type SidebarProps = {
  setSidebarOpen: (open: boolean) => void;
};

const Sidebar = ({ setSidebarOpen }: SidebarProps) => {
  return (
    <div className="mt-4 max-h-[80vh] overflow-y-auto scrollbar relative z-10">
      <div className="flex justify-end items-center px-4 mb-8">
        {/* <img src="/logo.svg" className="w-14 h-14 object-contain" /> */}
        <button className="button-click inline-flex h-8 w-8 justify-center items-center bg-orange rounded border border-dark-brown">
          <CrossIcon
            onClick={() => {
              setSidebarOpen(false);
            }}
          />
        </button>
      </div>
      <ul className="flex flex-col p-4">
        {NAVIGATION.map((navItem) => (
          <a
            key={navItem.name}
            className="font-michroma mb-4 text-base text-white pb-4 border-b-[0.5px] border-[#ebdbd2] cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            href={navItem.href}
          >
            {navItem.name}
          </a>
        ))}
        <button className="w-[150px] text-white border border-secondary py-2 px-6 font-normal text-sm rounded-full inline-flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-all ease-in-out duration-300 active:scale-[1.02]">
          Connect
          <WalletIcon />
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;
