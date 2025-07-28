import HeroSection from "../../components/Home/HeroSection";
import EventSection from "../../components/Home/EventSection";
import GallerySection from "../../components/Home/GallerySection";
import FaqSection from "../../components/Home/FaqSection";
// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  // const location = useLocation();
  // useEffect(() => {
  //   console.log(location.hash);
  //   if (location.hash) {
  //     const elementId = location.hash.replace("#", "");
  //     console.log(elementId);
  //     const element = document.getElementById(elementId);
  //     if (element) {
  //       const yOffset = -80; // Ubah sesuai tinggi navbar kamu (misalnya 80px)
  //       const y =
  //         element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  //       if (element) {
  //         element.scrollTo({ top: y, behavior: "smooth" });
  //       }
  //     }
  //   }
  // }, []);
  return (
    <div className="relative flex flex-col w-full -top-20">
      <HeroSection />
      <EventSection />
      <GallerySection />
      <FaqSection />
    </div>
  );
};

export default Home;
