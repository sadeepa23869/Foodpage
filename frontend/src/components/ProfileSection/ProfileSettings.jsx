import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().notRequired()
});

const ProfileSettings = ({ initialProfile, onSave, onCancel, onDelete }) => {
  const formik = useFormik({
    initialValues: {
      name: initialProfile.name,
      email: initialProfile.email,
      password: ''
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
    enableReinitialize: true
  });

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md border border-gray-200 flex flex-col p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Update Profile Settings</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            type="text"
            className="w-full border rounded px-3 py-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            value={formik.values.email}
            disabled
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
            value={formik.values.password || ''}
            placeholder="Leave blank to keep current password"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
          )}
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded font-semibold ml-auto"
            onClick={onDelete}
          >
            Delete Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
