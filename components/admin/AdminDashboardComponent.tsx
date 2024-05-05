import Link from "next/link";
import Footer from "../Footer";
import HeaderAdminComponent from "./HeaderAdmin";

const AdminDashboardComponent = () => {
  return (
    <div className="bg-white flex flex-col min-h-[100svh] w-screen justify-center items-center">
      <HeaderAdminComponent />
      <div className="w-full flex-1 max-w-4xl px-6 py-16">
        <h2 className="section-title ">Admin Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/admin/management/product"
            className="link-management-buttons">
            Manage Product Catalog
          </Link>
          <Link
            href="/admin/management/category"
            className="link-management-buttons">
            Manage Product Categories
          </Link>
          <Link
            href="/admin/management/brand"
            className="link-management-buttons">
            Manage Brands
          </Link>
          <Link
            href="/admin/management/vendor"
            className="link-management-buttons">
            Manage Vendors/Suppliers
          </Link>
          <Link
            href="/admin/management/management"
            className="link-management-buttons">
            View and Manage Orders
          </Link>
          <Link
            href="/admin/management/sales"
            className="link-management-buttons">
            View Sales Reports
          </Link>
          <Link
            href="/admin/management/users"
            className="link-management-buttons">
            Manage User Accounts
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardComponent;
