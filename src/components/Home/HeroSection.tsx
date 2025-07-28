import React from "react";
import HeroImage from "../../assets/images/Homepage cover.png";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-full min-h-screen overflow-hidden">
      <img
        src={HeroImage}
        alt=""
        className="object-cover object-center w-full h-screen"
      />
      <span className="absolute inset-0 flex items-center justify-start w-full h-full bg-black bg-opacity-0 max-w-[1480px] mx-auto ">
        <div className="flex flex-col items-start justify-center w-full gap-5 h-fit max-w-[987px] px-2">
          <h1 className="text-4xl font-bold text-white lg:text-8xl ">
            Menata Hati Tenangkan Hatimu
          </h1>
          <p className="lg:text-3xl text-lg text-left text-white max-w-[827px]">
            Cerita, Curhat, Doa & Muhasabah bersama <br /> Ustadz Hilman Fauzi.
            Kami hadir lebih dekat dengan Anda. Temukan event kami disini!
          </p>
          <Link
            to="/event"
            className="px-6 py-2 mt-2 text-lg text-white uppercase border rounded-full bg-primary border-primary bg-none w-fit"
          >
            Daftar Sekarang!
          </Link>
        </div>
      </span>
    </section>
  );
};

export default HeroSection;
