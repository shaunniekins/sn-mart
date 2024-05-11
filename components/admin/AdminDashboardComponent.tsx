import Link from "next/link";
import Footer from "../Footer";
import HeaderAdminComponent from "./HeaderAdmin";

const AdminDashboardComponent = () => {
  return (
    <>
      <h2 className="section-title ">Admin Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/authuser/management/product"
          className="link-management-buttons">
          Manage Product Catalog
        </Link>
        <Link
          href="/authuser/management/category"
          className="link-management-buttons">
          Manage Product Categories
        </Link>
        <Link
          href="/authuser/management/brand"
          className="link-management-buttons">
          Manage Brands
        </Link>
        <Link
          href="/authuser/management/vendor"
          className="link-management-buttons">
          Manage Vendors/Suppliers
        </Link>
        <Link
          href="/authuser/management/management"
          className="link-management-buttons">
          View and Manage Orders
        </Link>
        <Link
          href="/authuser/management/sales"
          className="link-management-buttons">
          View Sales Reports
        </Link>
        <Link
          href="/authuser/management/users"
          className="link-management-buttons">
          Manage User Accounts
        </Link>
      </div>
    </>
  );
};

export default AdminDashboardComponent;
