import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSideBar";
import DashBoardPage from "../Admin/DashBoardPage";
import InventoryPage from "../Admin/InventoryPage";
import CustomerSupport from "../Admin/CustomerSupport";

function Admin() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user && user.length === 0) {
      navigate("/");
    }
  });

  return (
    // <div className='flex justify-center items-center bg-red-500 p-2'>Welcome Admin</div>
    <div className="flex min-h-screen">
      <AdminSidebar changePage={setPage} />
      <div className="w-full min-h-screen">
        {page === 1 ? <DashBoardPage /> : <InventoryPage />}
      </div>
    </div>
  );
}

export default Admin;
