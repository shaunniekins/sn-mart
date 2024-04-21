// ProductsPageComponent
import Footer from "../landing_page/Footer";
import HeaderComponent from "../landing_page/Header";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";

type Props = {
  productCategory: string;
};

const ProductsPageComponent = ({ productCategory }: Props) => {
  return (
    <div className="overflow-y-auto bg-white flex flex-col min-h-[100svh]">
      <HeaderComponent />

      {/* <ProductFilters productCategory={productCategory} />*/}
      <ProductGrid productCategory={productCategory} />
      <Footer />
    </div>
  );
};

export default ProductsPageComponent;
