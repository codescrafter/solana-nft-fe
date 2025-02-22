import { NftTypes } from "types";
import Image from "next/image";
import { CandyMint } from "./CandyMint";

const Marketplace = () => {
  return (
    <div id="mint-now" className="relative">
      <Image
        src="/images/left-gradient.webp"
        alt="left gradient"
        width={90}
        height={500}
        className="object-contain h-full absolute left-0 top-0 hidden lg:block"
      />
      <Image
        src="/images/right-gradient.webp"
        alt="right gradient"
        width={90}
        height={500}
        className="object-contain h-full absolute right-0 top-0 hidden lg:block"
      />

      <div className="container-wrap mt-[113px] relative z-10">
        <div className="flex flex-col mt-2">
          <CandyMint />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
