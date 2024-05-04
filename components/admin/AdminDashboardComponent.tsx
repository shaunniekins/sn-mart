import Footer from "../Footer";
import HeaderAdminComponent from "./HeaderAdmin";

const AdminDashboardComponent = () => {
  return (
    <div className="bg-white flex flex-col min-h-[100svh] w-screen justify-center items-center">
      <HeaderAdminComponent />
      <div className="w-full max-w-4xl bg-red-200">
        <h2>Admin Dashboard</h2>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardComponent;
