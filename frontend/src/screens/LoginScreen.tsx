import { useContext } from "react";
import { useForm } from "react-hook-form";
import { MdEmail, MdLock } from "react-icons/md";
import { loginSchema, type LoginSchemaType } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const LoginScreen = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    console.log("Form Data:", data);
    // Send data to backend API
    try {
      console.log("data" + data);
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
          data
      );
      console.log(response);
      const { accessToken, refreshToken,user } = response.data.data;
      console.log("accesstoken" + accessToken);
      console.log("refreshToken" + refreshToken);

      auth?.login(accessToken,user);
      navigate('/home');
    }
    catch (error: any) {
      const message = error.response?.data?.message || error.message || "Login failed";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-auto">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary opacity-20 rounded-full filter blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent opacity-15 rounded-full filter blur-3xl animate-pulse pointer-events-none"></div>

      <div
        className="relative bg-surface w-full max-w-md p-6 md:p-12 rounded-lg sm:rounded-xl shadow-2xl text-center"
      >
        <h1 className="text-primary font-extrabold text-4xl mb-2 select-none">Delta App</h1>
        <p className="text-textSecondary mb-10 text-lg font-medium">
          Connect & organize events with new friends
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="text-left space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-textPrimary font-semibold text-sm">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-3 text-base rounded-lg border ${errors.email ? "border-red-500" : "border-border"
                  } focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
              <MdEmail className="absolute left-3 top-3.5 text-textSecondary w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-textPrimary font-semibold text-sm">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={`w-full pl-10 pr-4 py-3 text-base rounded-lg border ${errors.password ? "border-red-500" : "border-border"
                  } focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition`}
              />
              <MdLock className="absolute left-3 top-3.5 text-textSecondary w-5 h-5" />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
            <div className="text-right mt-2">
              <a href="#" className="text-primary font-semibold hover:underline text-sm">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-surface font-bold text-lg py-3 rounded-lg shadow-lg hover:bg-indigo-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <hr className="my-8 border-border" />

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-border rounded-lg py-3 text-textPrimary font-semibold hover:bg-accent hover:text-surface hover:border-accent transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
        >
          {/* Google SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.28 9.16 3.37l6.86-6.85C34.72 2.47 29.6 0 24 0 14.75 0 6.9 5.64 3.27 13.74l7.98 6.21C12.65 14.5 18.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.5 24c0-1.6-.15-3.13-.43-4.62H24v9.04h12.6c-.54 2.86-2.2 5.27-4.7 6.92l7.23 5.61C42.74 35.8 46.5 30.33 46.5 24z" />
            <path fill="#FBBC05" d="M10.8 28.54c-.47-1.42-.74-2.93-.74-4.54 0-1.6.27-3.12.74-4.54L3.27 13.74C1.16 17.86 0 22.66 0 28c0 5.34 1.16 10.14 3.27 14.26l7.53-5.72z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.94-2.14 15.91-5.82l-7.63-5.9c-2.14 1.44-4.9 2.3-8.28 2.3-5.27 0-9.78-3.56-11.37-8.33l-7.98 6.21C6.9 42.36 14.75 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-10 text-sm text-textSecondary">
          Don't have an account?{" "}
          <a href="/register" className="text-primary font-semibold hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
