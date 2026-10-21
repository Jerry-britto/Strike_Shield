import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import logo from "../../assets/shopping.png";
import api from "../../api/axios.js";
import { addUser } from "../../store/slice.js";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.length > 0) navigate("/");
  }, [user, navigate]);

  const login = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post("/user/login", data);
      if (res.status === 200) {
        dispatch(addUser(res.data.user));
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden flex-col justify-between bg-navy-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 font-display text-xl">
            S
          </span>
          <span className="font-display text-2xl tracking-wider">
            STRIKESHIELD
          </span>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-5xl leading-tight tracking-wide">
            Gear up.
            <br />
            Level up.
            <br />
            <span className="text-brand-500">Never back down.</span>
          </h2>
          <p className="mt-4 text-navy-300">
            Log in to access your cart, track orders and manage your token
            balance.
          </p>
        </div>
        <p className="text-sm text-navy-500">
          Premium boxing &amp; combat gear.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-navy-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <img
              src={logo}
              alt="StrikeShield"
              className="mx-auto mb-4 h-16 w-auto object-contain mix-blend-multiply"
            />
            <h1 className="text-center text-3xl font-bold text-navy-900">
              Welcome back
            </h1>
            <p className="mt-1 text-center text-navy-500">
              Log in to continue shopping
            </p>

            <form method="POST" onSubmit={handleSubmit(login)} className="mt-6">
              <label htmlFor="email" className="text-sm font-semibold text-navy-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="input-base mt-1.5"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}

              <label
                htmlFor="password"
                className="mt-4 block text-sm font-semibold text-navy-800"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-base pr-12"
                  {...register("password", { required: "Password is required" })}
                />
                <IconButton
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-6 w-full !py-3"
              >
                {submitting ? "Logging in…" : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-navy-600">
              New here?{" "}
              <NavLink
                to="/register"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Create an account
              </NavLink>
            </p>
            <p className="mt-2 text-center text-sm">
              <NavLink to="/" className="text-navy-500 hover:text-brand-600">
                ← Continue shopping as guest
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
