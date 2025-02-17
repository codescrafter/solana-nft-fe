const About = () => {
  return (
    <div className="container-wrap" id="about">
      <h2 className="heading mb-8 xl:mb-14 text-center mmd:text-left uppercase">
        WHO ARE <br className="mmd:hidden" /> <span className="text-primary"> DEFI ALLIANCE?</span>
      </h2>
      <div className="relative flex flex-col mmd:flex-row gap-10 lg:gap-20 items-center">
        <img src="/images/about-gradient.webp" className="absolute left-1/2 transform -translate-x-[48%] -translate-y-[10%] sm:-translate-y-[21%] w-full sm:w-[95%] h-[60%] sm:h-[85%] mmd:w-[70%] mmd:h-full mmd:left-[25%] mmd:top-[25%]" />
        <div className="xxs:w-[340px] sm:w-[480px] mmd:w-[580px] xl:w-[651px] h-[373px] sm:h-[400px] mmd:h-[500px] xl:h-[588px] relative z-10">
          <img
            src="/images/about-defi.webp"
            alt="about defi ALLIANCE"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full max-w-[420px] lg:max-w-[450px] xl:max-w-[542px] flex flex-col gap-4 lg:gap-6 text-white text-lg lg:text-xl xl:text-2xl font-poppins relative z-10 -top-4 sm:top-0">
          <p>
            At Defi Alliance, we are redefining the NFT space by empowering creators and collectors
            alike. Our platform is built on a decentralized ecosystem where artists receive 50%
            royalty on secondary sales, ensuring long-term rewards for their contributions.
          </p>
          <p>
            Whether you're an artist, collector, or investor, Defi Alliance is your gateway to the
            future of decentralized art and finance.
          </p>
          <button className="mint-button border w-[160px] border-secondary text-white py-2 px-6 font-semibold text-xl font-poppins rounded-xl flex items-center gap-2.5 cursor-pointer hover:scale-105 hover:transition-all ease-linear duration-200 active:scale-[1.02] mt-2 mmd:mt-0">
            Mint Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
