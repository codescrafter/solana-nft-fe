import Image from "next/image";

const Royalties = () => {
  return (
    <div className="container-wrap mt-24" id="royalties">
      <h2 className="heading relative top-8 text-center mmd:text-left uppercase">
        <span className="text-primary">Earn</span> <br className="mmd:hidden" /> While You Hold
      </h2>
      <div className="flex flex-col-reverse mmd:flex-row gap-8 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 text-white text-lg lg:text-xl xl:text-2xl font-poppins w-full max-w-[400px] lg:max-w-[480px] xl:max-w-[603px]">
          <p>
            At DeFi Alliance, we believe in rewarding our community. That’s why 50% of all NFT
            royalties are distributed back to holders, providing continuous earnings and long-term
            value.
          </p>
          <p>
            The more you hold, the more you earn—empowering you to grow within our decentralized
            ecosystem.
          </p>
          <button className="mint-button text-xl font-semibold border w-[160px] border-secondary text-white py-2 px-6 font-poppins rounded-xl flex items-center gap-2.5 cursor-pointer hover:scale-105 hover:transition-all ease-linear duration-200 active:scale-[1.02]">
            Mint Now
          </button>
        </div>
        <div className="w-full max-w-[400px] sm:max-w-[611px] h-[400px] mmd:h-[440px] lg:h-[493px] relative top-7 mmd:top-0">
          <Image
            src="/images/royalties.webp"
            alt="defi alliance royalties"
            className="w-full h-full object-contain"
            width={611}
            height={493}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Royalties;
