import HeaderAdminComponent from "@/components/admin/HeaderAdmin";
import Footer from "@/components/Footer";
import HeaderComponent from "@/components/landing_page/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SN Mart | Home",
  description: "Retail Store",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white flex flex-col min-h-[100svh] max-w-screen justify-center items-center">
      <HeaderComponent />
      <div className="h-full w-full">{children}</div>
      <Footer />
    </div>
  );
}
