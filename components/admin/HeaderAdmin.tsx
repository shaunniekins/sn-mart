"use client";

import Link from "next/link";
import Image from "next/image";
import { signOutAdmin } from "@/utils/functions/signOut";
import { Button } from "@nextui-org/react";
import { MdOutlineLogout } from "react-icons/md";
import { getUser } from "@/utils/functions/userFetch";
import { useEffect, useState } from "react";

const HeaderAdminComponent = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

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
          <div className="flex items-center gap-4">
            Hey, {user?.email}!
            <form action={signOutAdmin}>
              <Button
                isIconOnly
                radius="sm"
                className="bg-delete-theme hover:bg-delete-hover-theme text-white">
                <MdOutlineLogout />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdminComponent;
