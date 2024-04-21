import ProductDetailsPageComponent from "@/components/product_details/ProductDetailsPageComponent";

type Params = {
  productId: string;
  productCategory: string;
};

export default function Page({ params }: { params: Params }) {
  const { productId, productCategory } = params;

  return (
    <div>
      {/* <h1>Product ID: {productId}</h1> */}
      <ProductDetailsPageComponent
        productId={productId}
        productCategory={productCategory}
      />
    </div>
  );
}
