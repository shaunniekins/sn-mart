import Footer from "../landing_page/Footer";
import HeaderComponent from "../landing_page/Header";
import ProductDetails from "./ProductDetails";
import RelatedProducts from "./RelatedProducts";

type Props = {
  productId: string;
  productCategory: string;
};

const ProductDetailsPageComponent = ({ productId, productCategory }: Props) => {
  return (
    <div className="overflow-y-auto bg-white flex flex-col min-h-[100svh]">
      <HeaderComponent />
      <ProductDetails productId={productId} productCategory={productCategory} />
      {/* <RelatedProducts /> */}

      <Footer />
    </div>
  );
};

export default ProductDetailsPageComponent;
