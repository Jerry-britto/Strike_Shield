import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/axios.js";
import { removeUser, setCartCount } from "../../store/slice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const navItems = [
  { id: 1, label: "Dashboard", Icon: DashboardIcon },
  { id: 2, label: "Inventory", Icon: Inventory2Icon },
  { id: 3, label: "User Management", Icon: GroupsIcon },
];

const AdminSidebar = ({ changePage, activePage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    if (user && user.length > 0) {
      setAdminName(`${user[0].first_name} ${user[0].last_name}`);
    }
  }, [user]);

  const logout = async () => {
    try {
      await api.post("/user/logout", {});
      toast.success("Logged out successfully");
    } catch {
      toast.info("Session expired — you have been logged out");
    } finally {
      dispatch(removeUser());
      dispatch(setCartCount(0));
      navigate("/");
    }
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-navy-900 text-white">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-lg">
            S
          </span>
          <span className="font-display text-xl tracking-wider">STRIKESHIELD</span>
        </div>
        <div className="mt-6 rounded-xl bg-navy-800 p-4">
          <p className="text-xs uppercase tracking-wide text-navy-400">
            Signed in as
          </p>
          <p className="mt-1 font-semibold">{adminName || "Administrator"}</p>
          <span className="mt-2 inline-block rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold">
            Admin
          </span>
        </div>
      </div>

      <nav className="mt-2 flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activePage === id;
            return (
              <li key={id}>
                <button
                  onClick={() => changePage(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition ${
                    isActive
                      ? "bg-brand-600 text-white shadow"
                      : "text-navy-300 hover:bg-navy-800 hover:text-white"
                  }`}
                >
                  <Icon fontSize="small" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-2 p-3">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-navy-300 transition hover:bg-navy-800 hover:text-white"
        >
          <ArrowBackIcon fontSize="small" />
          Back to store
        </button>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl bg-navy-800 px-4 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          <LogoutIcon fontSize="small" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
