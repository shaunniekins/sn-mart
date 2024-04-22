import ProductsPageComponent from "@/components/product_listing/ProductPageComponent";

type Params = {
  productCategory: string;
};

export default function Page({ params }: { params: Params }) {
  const { productCategory } = params;

  return (
    <div>
      <ProductsPageComponent productCategory={productCategory} />
    </div>
  );
}
