import ProductsPageComponent from "@/app/components/product_listing/ProductPageComponent";

type Params = {
  productCategory: string;
};

export default function Page({ params }: { params: Params }) {
  const { productCategory } = params;

  return (
    <div>
      {/* <h1>Category: {productCategory}</h1> */}
      <ProductsPageComponent productCategory={productCategory} />
    </div>
  );
}
