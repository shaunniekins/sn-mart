import ProductDetailsPageComponent from "@/components/product_details/ProductDetailsPageComponent";

type Params = {
  productId: string;
  productCategory: string;
};

export default function Page({ params }: { params: Params }) {
  const { productId, productCategory } = params;

  return (
    <div>
      <ProductDetailsPageComponent
        productId={productId}
        productCategory={productCategory}
      />
    </div>
  );
}
