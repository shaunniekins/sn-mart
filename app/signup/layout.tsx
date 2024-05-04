const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SN Mart | Customer Signup",
  description: "Retail Store",
};

export default function CustomerSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center text-black bg-white">
        {children}
      </div>
    </>
  );
}
