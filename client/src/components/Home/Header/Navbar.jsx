import { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar, Badge, Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentsIcon from "@mui/icons-material/Payments";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../../assets/LOGO.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../../../api/axios.js";
import { removeUser, setCartCount } from "../../../store/slice.js";
import { formatINR } from "../../../utils/format.js";
import useCartCount from "../../../hooks/useCartCount.js";

const navLinkClass = ({ isActive }) =>
  `relative text-sm font-semibold tracking-wide transition-colors ${
    isActive ? "text-brand-500" : "text-navy-100 hover:text-brand-400"
  }`;

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const user = useSelector((state) => state.user);
  const cartCount = useSelector((state) => state.cartCount);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Keep the cart badge in sync with the server.
  useCartCount();

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const closeDrawer = () => setDrawerOpen(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isLoggedIn = user && user.length > 0;
  const initials = isLoggedIn
    ? `${user[0]?.first_name?.[0] || ""}${user[0]?.last_name?.[0] || ""}`.toUpperCase()
    : "";
  const tokenBalance = Number(user[0]?.tokens) || 0;

  const logout = async () => {
    try {
      await api.post("/user/logout", {});
      toast.success("Logged out successfully");
    } catch {
      // Clear the local session even if the server call fails (expired cookie).
      toast.info("Session expired — you have been logged out");
    } finally {
      dispatch(removeUser());
      dispatch(setCartCount(0));
      navigate("/");
    }
  };

  const searchForInput = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.warn("Kindly enter a product name to search");
      return;
    }
    try {
      const res = await api.get("/product/search", {
        params: { searchInput: searchInput.trim() },
      });
      const id = res.data?.productId;
      if (!id) throw new Error("Product not found");
      navigate(`/product/${id}`);
      setSearchInput("");
      closeDrawer();
    } catch {
      setSearchInput("");
      toast.error("No product matches that search");
    }
  };

  const closeAll = () => {
    handleClose();
    closeDrawer();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-navy-900/95 text-white shadow-lg backdrop-blur">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        {/* Logo */}
        <NavLink to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={logo}
            alt="StrikeShield logo"
            width={92}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>
        </nav>

        {/* Search + actions */}
        <div className="flex items-center gap-3">
          <form onSubmit={searchForInput} className="hidden items-center md:flex">
            <input
              type="search"
              name="search"
              id="search"
              aria-label="Search products"
              value={searchInput}
              autoComplete="off"
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search gloves…"
              className="w-40 rounded-l-xl border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-white placeholder-navy-400 transition focus:w-56 focus:border-brand-500 focus:outline-none lg:w-48"
            />
            <button
              type="submit"
              aria-label="Search"
              className="rounded-r-xl bg-brand-600 px-3 py-2.5 text-white transition hover:bg-brand-700"
            >
              <SearchIcon fontSize="small" />
            </button>
          </form>

          {isLoggedIn ? (
            <div className="hidden items-center gap-4 lg:flex">
              <span className="flex items-center gap-1 rounded-full bg-navy-800 px-3 py-1.5 text-sm font-semibold text-brand-400">
                <span aria-hidden>₹</span>
                {formatINR(tokenBalance).replace("₹", "")}
              </span>

              <Avatar
                onClick={handleClick}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                className="cursor-pointer bg-brand-600 font-semibold"
                sx={{ width: 40, height: 40 }}
              >
                {initials}
              </Avatar>

              <NavLink to="/carts" aria-label={`Cart, ${cartCount} items`} className="relative">
                <Badge badgeContent={cartCount} color="primary" overlap="circular">
                  <ShoppingCartIcon sx={{ fontSize: 28 }} />
                </Badge>
              </NavLink>

              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "account-button" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {user[0]?.isAdmin && (
                  <MenuItem onClick={() => { closeAll(); navigate("/admin"); }}>
                    <DashboardIcon fontSize="small" className="mr-2 text-navy-500" />
                    Admin Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={() => { closeAll(); navigate("/paymenthistory"); }}>
                  <PaymentsIcon fontSize="small" className="mr-2 text-navy-500" />
                  View Purchases
                </MenuItem>
                <MenuItem onClick={() => { closeAll(); logout(); }}>
                  <LogoutIcon fontSize="small" className="mr-2 text-navy-500" />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <NavLink to="/login" className="hidden btn-primary !py-2 lg:inline-flex">
              Login
            </NavLink>
          )}

          {/* Mobile menu trigger */}
          <div className="lg:hidden">
            <IconButton
              onClick={toggleDrawer}
              aria-label="Open menu"
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        <div className="flex h-full w-72 flex-col bg-navy-900 p-5 text-white">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-2xl tracking-wide">Menu</span>
            <IconButton onClick={closeDrawer} aria-label="Close menu" sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </div>

          <form onSubmit={searchForInput} className="mb-6 flex items-center">
            <input
              type="search"
              aria-label="Search products"
              value={searchInput}
              autoComplete="off"
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search gloves…"
              className="w-full rounded-l-xl border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-white placeholder-navy-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="rounded-r-xl bg-brand-600 px-3 py-2.5 text-white"
            >
              <SearchIcon fontSize="small" />
            </button>
          </form>

          <nav className="flex flex-col gap-1">
            <NavLink to="/" onClick={closeAll} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-navy-800">
              Home
            </NavLink>
            <NavLink to="/about" onClick={closeAll} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-navy-800">
              About Us
            </NavLink>
            <NavLink to="/contact" onClick={closeAll} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-navy-800">
              Contact Us
            </NavLink>
          </nav>

          <div className="mt-4 border-t border-navy-800 pt-4">
            {isLoggedIn ? (
              <div className="flex flex-col gap-1">
                <div className="mb-2 flex items-center gap-3 px-3">
                  <Avatar className="bg-brand-600 font-semibold">{initials}</Avatar>
                  <div>
                    <p className="text-sm font-semibold">
                      {user[0]?.first_name} {user[0]?.last_name}
                    </p>
                    <p className="text-xs text-brand-400">
                      Balance {formatINR(tokenBalance)}
                    </p>
                  </div>
                </div>
                <NavLink to="/carts" onClick={closeAll} className="flex items-center justify-between rounded-lg px-3 py-2.5 font-semibold hover:bg-navy-800">
                  Cart
                  {cartCount > 0 && (
                    <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/paymenthistory" onClick={closeAll} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-navy-800">
                  View Purchases
                </NavLink>
                {user[0]?.isAdmin && (
                  <NavLink to="/admin" onClick={closeAll} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-navy-800">
                    Admin Dashboard
                  </NavLink>
                )}
                <button
                  onClick={() => { closeAll(); logout(); }}
                  className="mt-3 rounded-lg bg-brand-600 px-3 py-2.5 font-semibold text-white hover:bg-brand-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={closeAll}
                className="block rounded-lg bg-brand-600 px-3 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
}
