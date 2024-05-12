import HeaderAdminComponent from "@/components/admin/HeaderAdmin";
import Footer from "@/components/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SN Mart | Store",
  description: "Retail Store",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white flex flex-col min-h-[100svh] max-w-screen justify-center items-center">
      <HeaderAdminComponent />
      <div className="w-full h-full max-w-4xl px-6 py-16">{children}</div>
      <Footer />
    </div>
  );
}
