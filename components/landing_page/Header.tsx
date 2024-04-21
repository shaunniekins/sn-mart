// Header.tsx
import Link from "next/link";
import Image from "next/image";
import { MdOutlinePerson2, MdOutlineShoppingCart } from "react-icons/md";

const HeaderComponent = () => {
  return (
    <header className="bg-purple-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center text-2xl font-bold">
          {/* <div className="bg-white rounded-full p-1"> */}
          <Image
            src="/images/sn-mart-logo.svg"
            alt="SN Mart Logo"
            width={45}
            height={45}
            className="rounded-full"
          />
          {/* </div> */}
          <span className="ml-2">SN Mart</span>
        </Link>
        <div className="flex-grow mx-4 lg:mx-64 hidden md:block">
          <input
            type="search"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 text-black active:border-purple-700 focus:outline-none"
          />
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/profile" className="hover:text-gray-300">
                <div className="flex gap-1 items-center">
                  <MdOutlinePerson2 className="text-xl" />
                  <h6 className="hidden md:block">Account</h6>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-gray-300">
                <div className="flex gap-1 items-center">
                  <MdOutlineShoppingCart className="text-xl" />
                  <h6 className="hidden md:block">Cart</h6>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderComponent;
