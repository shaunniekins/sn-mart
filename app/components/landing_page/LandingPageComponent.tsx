// LandingPageComponent.tsx

import dynamic from "next/dynamic";
import Footer from "./Footer";
import HeaderComponent from "./Header";
import HeroSection from "./HeroSection";
// import ProductCategories from "./ProductCategories";

const LandingPageComponent = () => {
  const ProductCategories = dynamic(() => import("./ProductCategories"), {
    loading: () => (
      <>
        <section className="py-10 px-4">
          <div className="container mx-auto text-center">
            <h1>Loading...</h1>
          </div>
        </section>
      </>
    ),
    ssr: false,
  });

  return (
    <div className="overflow-y-auto bg-white flex flex-col min-h-[100svh]">
      <HeaderComponent />
      <HeroSection />
      <ProductCategories />
      <Footer />
    </div>
  );
};

export default LandingPageComponent;
