import Footer from "../Footer";
import HeaderComponent from "../landing_page/Header";
import ProductGrid from "./ProductGrid";

type Props = {
  productCategory: string;
};

const ProductsPageComponent = ({ productCategory }: Props) => {
  return (
    <div className="overflow-y-auto bg-white flex flex-col min-h-[100svh]">
      <HeaderComponent />
      <ProductGrid productCategory={productCategory} />
      <Footer />
    </div>
  );
};

export default ProductsPageComponent;
