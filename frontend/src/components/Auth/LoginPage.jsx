import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoginGoogleOAuthButton from "./LoginGoogleOAuthButton";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid Gmail address").matches(/@gmail\.com$/, "Only Gmail accounts allowed").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = ({ onLogin, onShowSignup }) => {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      onLogin(values);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Sign In</h2>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium">Gmail</label>
            <input
              name="email"
              type="email"
              className="w-full border rounded px-3 py-2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="yourname@gmail.com"
              autoComplete="username"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              name="password"
              type="password"
              className="w-full border rounded px-3 py-2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-2"
          >
            Sign In
          </button>
        </form>
        {/* Google login button at the bottom */}
        <LoginGoogleOAuthButton />
        <div className="text-center mt-4">
          <span>Don't have an account? </span>
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={onShowSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
