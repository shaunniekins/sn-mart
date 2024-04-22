import Footer from "../landing_page/Footer";
import HeaderAdminComponent from "./HeaderAdmin";

const AdminDashboardComponent = () => {
  return (
    <div className="overflow-y-auto bg-white flex flex-col min-h-[100svh]">
      <HeaderAdminComponent />
      <div>Admin Dashboard</div>
      <Footer />
    </div>
  );
};

export default AdminDashboardComponent;
