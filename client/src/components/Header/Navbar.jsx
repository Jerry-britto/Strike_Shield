import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, Divider, Drawer } from "@mui/material";
import logo from "../../assets/LOGO.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-around items-center bg-slate-950  p-3 w-full text-white shadow-2xl">
        <div className="cursor-pointer mr-20 mb-4 lg:mr-0 lg:mb-0">
          <img src={logo} alt="LOGO" width={"100"} />
        </div>
        <div className="flex gap-5">
          <div className="cursor-pointer font-medium text-lg hover:text-orange-500 lg:block hidden">
            Home
          </div>
          <div className="cursor-pointer font-medium text-lg hover:text-orange-500 lg:block hidden">
            About Us
          </div>
          <div className="cursor-pointer text-lg font-medium hover:text-orange-500 lg:block hidden">
            Contact Us
          </div>
        </div>

        <div className="flex gap-5">
          <div>
            <input
              type="text"
              name="search"
              id="search"
              className="py-2 px-1 text-black rounded-lg"
            />
            <button className="border p-2 outline-none rounded-md relative right-[4rem] box-border bg-orange-600 text-black mx-0 font-semibold hover:text-white">
              Search
            </button>
          </div>
          <div className="font-semibold text-lg border p-2 box-border rounded-xl cursor-pointer lg:block hidden bg-orange-500 text-black">
            Login/Register
          </div>
          <div className="font-medium mt-2 cursor-pointer hidden lg:block">
            <Badge badgeContent={4} color="primary">
              <ShoppingCartIcon style={{ fontSize: "30px" }} />
            </Badge>
          </div>
          <div className="lg:hidden block mt-1  cursor-pointer text-2xl">
            <button onClick={toggleOpen}>
              <MenuIcon />
            </button>
            <Drawer onClose={toggleOpen} open={open} anchor="right">
              <ul className="list-none flex flex-col gap-4 p-14">
                <li className="font-semibold cursor-pointer">Home</li>
                <li className="font-semibold cursor-pointer">About Us</li>
                <li className="font-semibold cursor-pointer">Contact Us</li>
              </ul>
              <Divider />

              <button className="rounded-md mx-12 p-3 mt-4 text-black font-semibold bg-orange-600 ">
                Login/Register
              </button>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}
