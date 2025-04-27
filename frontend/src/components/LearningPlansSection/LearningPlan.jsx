import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const LearningPlanCard = ({ plan, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-xl mx-auto border border-gray-200">
<h3 className="text-2xl font-semibold mb-2" style={{ color: '#f5e042' }}>
  {plan.name}
</h3>
    <p className="mb-4 text-gray-700">{plan.description}</p>
    <div className="mb-2">
      <strong className="text-gray-800">Topics:</strong>
      <ul className="list-disc list-inside ml-4">
        {(plan.topics || []).map((topic, idx) => (
          <li key={idx} className="text-gray-600">{topic}</li>
        ))}
      </ul>
    </div>
    <div>
      <strong className="text-gray-800">Resources:</strong>
      <ul className="list-disc list-inside ml-4">
        {(plan.resources || []).map((resource, idx) => (
          <li key={idx} className="text-gray-600">{resource}</li>
        ))}
      </ul>
    </div>
    <div className="flex mt-4 space-x-2">
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded"
        onClick={onEdit}
      >Edit</button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
        onClick={onDelete}
      >Delete</button>
    </div>
  </div>
);

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  topics: Yup.string().required("At least one topic is required"),
  resources: Yup.string().required("At least one resource is required"),
});

const LearningPlans = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch learning plans from backend
  const fetchLearningPlans = () => {
    fetch("http://localhost:4043/api/learningplans/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => setLearningPlans(data))
      .catch((err) => console.error("Error fetching learning plans:", err));
  };

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      topics: "",
      resources: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      const plan = {
        name: values.name,
        description: values.description,
        topics: values.topics.split(",").map((t) => t.trim()).filter(Boolean),
        resources: values.resources.split(",").map((r) => r.trim()).filter(Boolean),
      };
      if (editIndex !== null) {
        // Update
        const planId = learningPlans[editIndex].id;
        fetch(`http://localhost:4043/api/learningplans/${planId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(plan),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Update failed");
            return res.json();
          })
          .then(() => {
            fetchLearningPlans();
            setEditIndex(null);
            resetForm();
          })
          .catch((err) => alert("Failed to update: " + err.message));
      } else {
        // Create
        fetch("http://localhost:4043/api/learningplans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(plan),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Create failed");
            return res.json();
          })
          .then(() => {
            fetchLearningPlans();
            resetForm();
          })
          .catch((err) => alert("Failed to create: " + err.message));
      }
    },
  });

  const handleEdit = (index) => {
    setEditIndex(index);
    const plan = learningPlans[index];
    formik.setValues({
      name: plan.name,
      description: plan.description,
      topics: plan.topics.join(", "),
      resources: plan.resources.join(", "),
    });
  };

  const handleDelete = (index) => {
    const planId = learningPlans[index].id;
    if (!window.confirm("Are you sure you want to delete this learning plan?")) return;
    fetch(`http://localhost:4043/api/learningplans/${planId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        fetchLearningPlans();
        if (editIndex === index) {
          setEditIndex(null);
          formik.resetForm();
        }
      })
      .catch((err) => alert("Failed to delete: " + err.message));
  };

  return (
    <div className="learning-plans-container bg-gray-50 min-h-screen py-8">
      <form className="bg-white max-w-xl mx-auto rounded-lg shadow-md p-6 mb-8 border border-blue-200" onSubmit={formik.handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-blue-700">{editIndex !== null ? 'Edit Learning Plan' : 'Create a New Learning Plan'}</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="topics">Topics <span className="text-xs text-gray-500">(comma separated)</span></label>
          <input
            id="topics"
            name="topics"
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.topics}
          />
          {formik.touched.topics && formik.errors.topics && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.topics}</div>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="resources">Resources <span className="text-xs text-gray-500">(comma separated)</span></label>
          <input
            id="resources"
            name="resources"
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.resources}
          />
          {formik.touched.resources && formik.errors.resources && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.resources}</div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition font-semibold"
          >
            {editIndex !== null ? 'Update Learning Plan' : 'Add Learning Plan'}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              className="w-full bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition font-semibold"
              onClick={() => { setEditIndex(null); formik.resetForm(); }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {learningPlans.map((plan, index) => (
        <LearningPlanCard
          key={plan.id}
          plan={plan}
          onEdit={() => handleEdit(index)}
          onDelete={() => handleDelete(index)}
        />
      ))}
    </div>
  );
};

export default LearningPlans;
