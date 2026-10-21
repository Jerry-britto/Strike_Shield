import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import AdminSidebar from "../../components/Admin/AdminSideBar.jsx";

// Page components are imported eagerly here (they're already behind the
// lazily-loaded /admin route), keeping the internal tab switch instant.
import DashBoardPage from "../Admin/DashBoardPage.jsx";
import InventoryPage from "../Admin/InventoryPage.jsx";
import CustomerSupport from "../Admin/CustomerSupport.jsx";

function Admin() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.length === 0) {
      navigate("/");
    } else if (!user[0]?.isAdmin) {
      // A non-admin logged-in user has no business on the admin dashboard.
      navigate("/");
    }
  }, [user, navigate]);

  const changePage = (p) => {
    setPage(p);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-navy-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar changePage={changePage} activePage={page} />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/60"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <AdminSidebar changePage={changePage} activePage={page} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-navy-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <IconButton onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
            <span className="font-display text-xl tracking-wide text-navy-900">
              Admin
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {page === 1 && <DashBoardPage />}
          {page === 2 && <InventoryPage />}
          {page === 3 && <CustomerSupport />}
        </div>
      </div>
    </div>
  );
}

export default Admin;
