import { CrownBottom, CrownTop } from "svg";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
  return (
    <div className="bg-[url(/images/header_bg.webp)] bg-cover bg-center 2xl:bg-top overflow-x-hidden">
      <div className="relative mb-9">
        <Navbar />
        <h1 className="w-full max-w-[1320px] mx-auto linear-header-text text-center text-4xl xxs:text-[46px] xs:text-[52px] sm:text-[80px] md:text-[90px] lg:text-[120px] llg:text-[140px] xxl:text-[170px] font-semibold sm:leading-[72px] lg:leading-[294px] tracking-[-2px] mt-12 mb-5 lg:mt-0">
          DEFI ALLIANCE
        </h1>
        <div className="flex justify-center">
          <p className="text-dust lg:hidden text-base xxs:text-lg sm:text-2xl text-center max-w-[337px] sm:max-w-[560px] md:max-w-[650px]">
            NFTs That Pay You Back – Get Passive Rewards Earn While You Hold –{" "}
            <span className="text-white">50% NFT Royalties</span> for Holders
          </p>
        </div>
        <div>
          <div className="absolute left-1/2 top-[60%] sm:top-[55%] lg:top-[48%] transform -translate-x-1/2 -translate-y-[50%] z-10 flex justify-center lg:block w-full lg:w-auto">
            <div className="hidden absolute -left-[40%] llg:-left-[45%] xxl:-left-[65%] 2xl:-left-[70%] top-[25%] text-dust w-full max-w-[290px] text-xl font-poppins lg:flex justify-between">
              <p>
                NFTs That Pay You Back – Get Passive Rewards Earn While You Hold –{" "}
                <span className="text-white">50% NFT Royalties</span> for Holders
              </p>
            </div>
            <div className="relative">
              <Image
                src="/images/defi-alliance-img.webp"
                alt="defi alliance"
                className="w-[327px] sm:w-[420px] lg:w-[540px] h-[375px] sm:h-[505px] lg:h-[617px] object-contain"
                width={540}
                height={617}
                priority
              />
              <div className="lg:hidden absolute left-0 xxs:-left-[2%] xs:-left-[14%] md:-left-[8%] top-[20%]">
                <Image
                  src="/images/vector-left.svg"
                  className="w-[100px] xs:w-auto object-contain"
                  width={100}
                  height={100}
                  alt="vector left"
                  priority
                />
                <p className="text-dawn-pink text-left ml-1 md:ml-2 text-xs xs:text-sm">
                  50% Royalties
                </p>
              </div>
            </div>

            <div className="hidden absolute -right-[20%] top-[18%] lg:flex items-center">
              <Image
                src="/images/vector.svg"
                className="object-contain"
                width={150}
                height={100}
                alt="vector"
                priority
              />
              <p className="text-dawn-pink text-right relative top-5 leading-3 llg:left-5 text-xl">
                50% Royalties
              </p>
            </div>
            <div className="hidden lg:block absolute bottom-[30%] -right-[35%] llg:-right-[40%] xxl:-right-[60%]">
              <FloatingButtons />
            </div>
          </div>
        </div>
        <div className="relative w-full h-[500px] sm:h-[700px] flex items-center justify-center overflow-hidden text-xl font-poppins leading-[30px]">
          {/* 🔹 Top Left to Bottom Right */}
          <div className="relative h-[290px] w-full top-[27%] sm:top-[24%] lg:top-[14%]">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300%] -rotate-[8deg] z-20">
              <div className="flex w-full overflow-hidden">
                <div className="bg-dark text-white py-4 sm:py-6 px-4 sm:px-6 flex items-center space-x-4">
                  <div className="marquee">
                    <div className="marquee-content flex min-w-[200%]">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="flex space-x-12 text-sm sm:text-base ms:text-lg lg:text-xl"
                        >
                          {Array(20)
                            .fill("Earn 50% Royalties")
                            .map((text, index) => (
                              <span key={index} className="inline-flex items-center gap-5">
                                {text}
                                <CrownBottom />
                              </span>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔹 Bottom Left to Top Right */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300%] rotate-[8deg]">
              <div className="flex w-full overflow-hidden">
                <div className="bg-dark text-white py-4 sm:py-6 px-4 sm:px-6 flex items-center space-x-4">
                  <div className="marquee">
                    <div className="marquee-content flex min-w-[200%]">
                      {[...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="flex space-x-12 text-sm sm:text-base ms:text-lg lg:text-xl"
                        >
                          {Array(20)
                            .fill("Earn 50% Royalties")
                            .map((text, index) => (
                              <span key={index} className="inline-flex items-center gap-5">
                                {text}
                                <CrownTop />
                              </span>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

function FloatingButtons() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center space-y-2">
      {/* Button 1 */}
      <button
        className="border border-white text-white px-4 py-2 rounded-lg transform"
        onClick={() => {
          router.push("/nfts");
        }}
      >
        Explore NFTs
      </button>

      {/* Button 2 */}
      <button
        className="relative left-14 border border-white text-white px-4 py-2 rounded-lg transform"
        onClick={() => {
          const element = document.getElementById("royalties");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        Check Royalties
      </button>

      {/* Button 3 */}
      <button
        className="border border-white text-white px-4 py-2 rounded-lg transform rotate-6"
        onClick={() => {
          const element = document.getElementById("mint-now");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        Mint Now
      </button>
    </div>
  );
}
