import { Facebook, Github, Instagram, Twitter } from "../svg";

const MyFooter = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white py-10 font-poppins ">
      <div className="container-wrap">
        <div className="mb-10">
          {/* <img src="/logo.svg" alt="bandts" className="w-[86px] h-[53px] object-contain" /> */}
        </div>
        <div className="px-4 flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex space-x-4 my-4 md:my-0">
            {SocialIcon.map((social, index) => (
              <div
                key={index}
                className="bg-[#FFFFFF1A] p-2 rounded-full h-10 w-10 border border-[#FFFFFF3D] flex justify-center items-center hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer"
              >
                {social}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm">
            <a href="#" className="hover:underline font-semibold">
              Company
            </a>
            <a href="#" className="hover:underline">
              About Us
            </a>
            <a href="#" className="hover:underline">
              Mint Now
            </a>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400 flex justify-between items-center flex-col-reverse sm:flex-row gap-4">
          <p>&copy; 2025 Bandts. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MyFooter;

const SocialIcon = [
  <Instagram key="instagram" />,
  <Facebook key="facebook" />,
  <Twitter key="twitter" />,
  <Github key="github" />,
];
