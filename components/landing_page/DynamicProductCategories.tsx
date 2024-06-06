// DynamicProductCategories.tsx
import dynamic from "next/dynamic";

const DynamicProductCategories = dynamic(() => import("./ProductCategories"), {
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

export default DynamicProductCategories;
