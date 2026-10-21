import { useEffect, useState } from "react";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useSelector } from "react-redux";

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector((state) => state.user);
  const redirect = useNavigate();

  useEffect(() => {
    if (user && user.length > 0) redirect("/");
  }, [user, redirect]);

  const onSubmit = async (data) => {
    const { password, cpassword } = data;
    if (password !== cpassword) {
      toast.error("Your passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/user/register", data);
      if (res.status === 200) {
        toast.success("Account created! Please log in.");
        reset();
        redirect("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form panel */}
      <div className="flex items-center justify-center bg-navy-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="card relative p-8">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70">
                <CircularProgress size={48} />
              </div>
            )}

            <h1 className="text-center text-3xl font-bold text-navy-900">
              <span className="text-brand-600">Create</span> an account
            </h1>
            <p className="mt-1 text-center text-navy-500">
              Join StrikeShield to start shopping
            </p>

            <form method="POST" onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <TextField
                    type="text"
                    label="First name"
                    fullWidth
                    error={!!errors.first_name}
                    helperText={errors.first_name ? "First name is required" : ""}
                    {...register("first_name", { required: true })}
                  />
                </div>
                <div>
                  <TextField
                    type="text"
                    label="Last name"
                    fullWidth
                    error={!!errors.last_name}
                    helperText={errors.last_name ? "Last name is required" : ""}
                    {...register("last_name", { required: true })}
                  />
                </div>
              </div>

              <div className="mt-3">
                <TextField
                  type="email"
                  label="Email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email ? "A valid email is required" : ""}
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+\.\S+$/,
                  })}
                />
              </div>

              <div className="mt-3">
                <TextField
                  type="text"
                  label="Address"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address ? "Address is required" : ""}
                  {...register("address", { required: true })}
                />
              </div>

              {/* Fixed: previously showed the ADDRESS error for the mobile field */}
              <div className="mt-3">
                <TextField
                  type="tel"
                  label="Mobile"
                  fullWidth
                  error={!!errors.mobile}
                  helperText={errors.mobile ? "Mobile number is required" : ""}
                  {...register("mobile", {
                    required: true,
                    pattern: /^[0-9]{10}$/,
                  })}
                />
              </div>

              <div className="relative mt-3">
                <TextField
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  fullWidth
                  error={!!errors.password}
                  helperText={
                    errors.password
                      ? "Password must be at least 6 characters"
                      : ""
                  }
                  {...register("password", { required: true, minLength: 6 })}
                />
              </div>

              <div className="mt-3">
                <TextField
                  type={showPassword ? "text" : "password"}
                  label="Confirm password"
                  fullWidth
                  error={!!errors.cpassword}
                  helperText={errors.cpassword ? "Please confirm password" : ""}
                  {...register("cpassword", { required: true, minLength: 6 })}
                />
                <div className="mt-1 flex items-center gap-1 text-sm text-navy-600">
                  <IconButton
                    type="button"
                    size="small"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                  {showPassword ? "Hide" : "Show"} passwords
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary mt-6 w-full !py-3"
              >
                {isLoading ? "Creating account…" : "Register"}
              </button>
            </form>

            <p className="mt-6 text-center text-navy-600">
              Already registered?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Login
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
            Join the
            <br />
            <span className="text-brand-500">fight club.</span>
          </h2>
          <p className="mt-4 text-navy-300">
            Create an account to save your cart, track orders and unlock member
            pricing.
          </p>
        </div>
        <p className="text-sm text-navy-500">
          Premium boxing &amp; combat gear.
        </p>
      </div>
    </div>
  );
}
