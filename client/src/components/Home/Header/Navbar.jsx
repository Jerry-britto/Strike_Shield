import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar, Badge, Divider, Drawer, Menu, MenuItem } from "@mui/material";
import logo from "../../../assets/LOGO.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { removeUser } from "../../../store/slice.js";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleOpen = () => {
    setDrawerOpen((prev) => !prev);
  };

  // for handling menu after login
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(()=>{
    console.log("logged in user - ",user);  
  },[])

  const logout = async () => {
    console.log("logout");
    try {
      const res = await Axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      // console.log(res);

      if (res.status >= 200 && res.status <= 300) {
        dispatch(removeUser());

        toast.success("Logged out successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/");
      }
    } catch (error) {
      console.log("could not logout due to ", error.message);
      toast.error("Could not logout please try again", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const validUser = async () => {
    try {
      const res = await Axios.get(
        "http://localhost:8000/api/v1/user/validuser",
        { withCredentials: true }
      );

      if (res.status === 200) {
        console.log(res.data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const searchForInput = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.warn("Kindly enter a valid product name", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      console.log(searchInput);
      try {
        const res = await Axios.get(
          `http://localhost:8000/api/v1/product/search?searchInput=${searchInput}`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          const id = res.data.productId || "";
          if (id) {
            navigate(`/product/${id}`);
          } else {
            throw Error("Product not found");
          }
          setSearchInput("");
        } else {
          throw Error("Product not found");
        }
      } catch (error) {
        console.log(error);
        setSearchInput("");
        toast.error("gloves does not exist", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-around items-center bg-slate-950  p-3 w-full text-white shadow-2xl">
        <div className="cursor-pointer mr-20 mb-4 lg:mr-0 lg:mb-0">
          <img src={logo} alt="LOGO" width={"100"} />
        </div>
        <div className="flex gap-5">
          <NavLink
            to={"/"}
            className="cursor-pointer font-medium text-lg hover:text-orange-500 lg:block hidden"
          >
            Home
          </NavLink>
          <NavLink to={"/about"} className="cursor-pointer font-medium text-lg hover:text-orange-500 lg:block hidden">
            About Us
          </NavLink>
          <NavLink to={"/contact"} className="cursor-pointer text-lg font-medium hover:text-orange-500 lg:block hidden">
            Contact Us
          </NavLink>
        </div>

        <div className="flex gap-5">
          <form onSubmit={searchForInput}>
            <input
              type="text"
              name="search"
              id="search"
              value={searchInput}
              autoComplete="off"
              onChange={(e) => setSearchInput(e.target.value)}
              className="py-2 px-1 text-black rounded-lg"
            />
            <button className="border p-2 outline-none rounded-md relative right-[4rem] box-border bg-orange-600 text-black mx-0 font-semibold hover:text-white">
              Search
            </button>
          </form>

          {user.length === 0 ? (
            <NavLink
              to={"/login"}
              className="font-semibold text-lg border p-2 box-border rounded-lg  cursor-pointer lg:block hidden bg-orange-500 text-black hover:text-white"
            >
              Login
            </NavLink>
          ) : (
            <div className=" font-medium mt-2 cursor-pointer hidden lg:flex lg:gap-10">
              <span className="cursor-default mt-2 text-xl">
                <CurrencyRupeeIcon/>
              {user[0].tokens.toFixed(2)}
              </span>
              <Avatar
                style={{ backgroundColor: "blue", color: "white" }}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                {user && user[0].first_name[0].toUpperCase()}
                {user && user[0].last_name[0].toUpperCase()}
              </Avatar>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>
                  <div onClick={() => navigate("/paymenthistory")}>
                    <CurrencyRupeeIcon />
                    View Purchases
                  </div>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <div onClick={logout}>
                    <LogoutIcon />
                    Logout
                  </div>
                </MenuItem>
              </Menu>
              <NavLink to={"/carts"}>
                <Badge color="primary">
                  <ShoppingCartIcon style={{ fontSize: "30px" }} />
                </Badge>
              </NavLink>
            </div>
          )}

          <div className="lg:hidden block mt-1  cursor-pointer text-2xl">
            <button onClick={toggleOpen}>
              <MenuIcon />
            </button>
            <Drawer onClose={toggleOpen} open={drawerOpen} anchor="right">
              <ul className="list-none flex flex-col gap-4 p-14">
                <NavLink
                  to={"/"}
                  className="font-semibold cursor-pointer hover:text-orange-500"
                >
                  Home
                </NavLink>
                <li
                  onClick={validUser}
                  className="font-semibold cursor-pointer hover:text-orange-500"
                >
                  About Us
                </li>
                <li className="font-semibold cursor-pointer hover:text-orange-500">
                  Contact Us
                </li>
              </ul>
              <Divider />

              {!user ? (
                <NavLink
                  to={"/login"}
                  className="text-center rounded-md mx-12 p-3 mt-4 text-white font-semibold bg-orange-600 "
                >
                  Login
                </NavLink>
              ) : (
                <button
                  className="bg-orange-600 mx-12 mt-2 p-2 text-white rounded-md"
                  onClick={logout}
                >
                  <LogoutIcon />
                  Logout
                </button>
              )}
            </Drawer>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
