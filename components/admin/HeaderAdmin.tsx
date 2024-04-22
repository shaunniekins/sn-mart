// Header.tsx
import Link from "next/link";
import Image from "next/image";
import AuthButton from "../AuthButton";

const HeaderAdminComponent = () => {
  return (
    <header className="bg-purple-700 text-white p-4 w-full flex items-center justify-center">
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

          <nav>
            <ul className="flex space-x-10">
              <li>
                <Link href="/profile" className="hover:text-gray-300">
                  <h6 className="">Profile</h6>
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-gray-300">
                  <h6 className="">Inventory</h6>
                </Link>
              </li>
              <li>
                <Link href="/purchases" className="hover:text-gray-300">
                  <h6 className="">Purchases History</h6>
                </Link>
              </li>
              <li>
                <Link href="/cashier" className="hover:text-gray-300">
                  <h6 className="">Cashier Record</h6>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdminComponent;
