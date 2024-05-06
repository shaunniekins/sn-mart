// Header.tsx
import Link from "next/link";
import Image from "next/image";
import AuthButton from "../AuthButton";

const HeaderAdminComponent = () => {
  return (
    <header className="bg-main-theme text-white p-4 w-full flex items-center justify-center">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <Link
          href="/admin/protected"
          className="flex items-center text-2xl font-bold">
          <Image
            src="/images/sn-mart-logo.svg"
            alt="SN Mart Logo"
            width={45}
            height={45}
            className="rounded-full"
          />
          <span className="ml-2">SN Mart</span>
        </Link>

        <div className="flex flex-col justify-end items-end">
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default HeaderAdminComponent;
