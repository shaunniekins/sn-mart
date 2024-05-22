import Link from "next/link";

const AdminDashboardComponent = () => {
  return (
    <>
      <h2 className="section-title ">Admin Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/authuser/admin/management/product"
          className="link-management-buttons">
          Manage Product Catalog
        </Link>
        <Link
          href="/authuser/admin/management/category"
          className="link-management-buttons">
          Manage Product Categories
        </Link>
        <Link
          href="/authuser/admin/management/brand"
          className="link-management-buttons">
          Manage Brands
        </Link>
        <Link
          href="/authuser/admin/management/management"
          className="link-management-buttons">
          View and Manage Orders
        </Link>
        <Link
          href="/authuser/admin/management/store"
          className="link-management-buttons">
          View Stores
        </Link>
        <Link
          href="/authuser/admin/management/vendor"
          className="link-management-buttons">
          Manage Vendors/Suppliers
        </Link>
        <Link
          href="/authuser/admin/management/sales"
          className="link-management-buttons">
          View Sales Reports
        </Link>
        <Link
          href="/authuser/admin/management/users"
          className="link-management-buttons">
          Manage User Accounts
        </Link>
      </div>
    </>
  );
};

export default AdminDashboardComponent;
