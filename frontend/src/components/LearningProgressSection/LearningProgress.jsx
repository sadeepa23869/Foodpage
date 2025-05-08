import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ProgressCard = ({ progress, onEdit, onDelete, onToggleComplete }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-xl mx-auto border border-gray-200">
    <h3 className="text-2xl font-semibold mb-2 text-green-700">{progress.name}</h3>
    <p className="mb-4 text-gray-700">{progress.description}</p>
    <div className="mb-2">
      <strong className="text-gray-800">Topics:</strong>
      <ul className="list-disc list-inside ml-4">
        {progress.topics.map((topic, idx) => (
          <li key={idx} className="flex items-center">
            <input
              type="checkbox"
              checked={topic.completed}
              onChange={() => onToggleComplete(progress.id, topic.name, !topic.completed)}
              className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className={`${topic.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {topic.name}
              {topic.notes && <span className="text-xs text-gray-500 ml-2">({topic.notes})</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div className="mb-2">
      <strong className="text-gray-800">Resources:</strong>
      <ul className="list-disc list-inside ml-4">
        {progress.resources.map((resource, idx) => (
          <li key={idx} className="text-gray-600">
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {resource.name} ({resource.type})
            </a>
          </li>
        ))}
      </ul>
    </div>
    <div className="mb-4">
      <strong className="text-gray-800">Progress:</strong> <span className="text-green-700 font-semibold">{progress.progress}%</span>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div 
          className="bg-green-600 h-2.5 rounded-full" 
          style={{ width: `${progress.progress}%` }}
        ></div>
      </div>
    </div>
    <div className="flex mt-4 space-x-2">
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded"
        onClick={() => onEdit(progress.id)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
        onClick={() => onDelete(progress.id)}
      >
        Delete
      </button>
    </div>
  </div>
);

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

const LearningProgress = () => {
  const [progressList, setProgressList] = useState([]);
  const [filteredProgress, setFilteredProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [topics, setTopics] = useState([{ name: "", completed: false, notes: "" }]);
  const [resources, setResources] = useState([{ name: "", url: "", type: "" }]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4043/api/learning-progress', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProgressList(response.data);
        setFilteredProgress(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch learning progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProgress(progressList);
    } else {
      const filtered = progressList.filter(progress => {
        const searchLower = searchTerm.toLowerCase();
        return (
          progress.name.toLowerCase().includes(searchLower) ||
          progress.description.toLowerCase().includes(searchLower) ||
          progress.topics.some(topic => topic.name.toLowerCase().includes(searchLower))
        );
      });
      setFilteredProgress(filtered);
    }
  }, [searchTerm, progressList]);

  const calculateProgress = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completedCount = topics.filter(t => t.completed).length;
    return Math.round((completedCount / topics.length) * 100);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('token');
        const progressData = {
          ...values,
          topics: topics.filter(t => t.name.trim() !== ""),
          resources: resources.filter(r => r.name.trim() !== ""),
          progress: calculateProgress(topics.filter(t => t.name.trim() !== ""))
        };

        if (editId) {
          const response = await axios.put(
            `http://localhost:4043/api/learning-progress/${editId}`,
            progressData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setProgressList(prev => prev.map(p => p.id === editId ? response.data : p));
        } else {
          const response = await axios.post(
            'http://localhost:4043/api/learning-progress',
            progressData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setProgressList(prev => [...prev, response.data]);
        }

        resetForm();
        setEditId(null);
        setTopics([{ name: "", completed: false, notes: "" }]);
        setResources([{ name: "", url: "", type: "" }]);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to save learning progress');
      }
    },
  });

  const handleEdit = (id) => {
    const progress = progressList.find(p => p.id === id);
    if (progress) {
      setEditId(id);
      formik.setValues({
        name: progress.name,
        description: progress.description,
      });
      setTopics(progress.topics.length > 0 ? progress.topics : [{ name: "", completed: false, notes: "" }]);
      setResources(progress.resources.length > 0 ? progress.resources : [{ name: "", url: "", type: "" }]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning progress?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4043/api/learning-progress/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProgressList(prev => prev.filter(p => p.id !== id));
        if (editId === id) {
          setEditId(null);
          formik.resetForm();
          setTopics([{ name: "", completed: false, notes: "" }]);
          setResources([{ name: "", url: "", type: "" }]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete learning progress');
      }
    }
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index][field] = value;
    setTopics(updatedTopics);
  };

  const addTopic = () => {
    setTopics([...topics, { name: "", completed: false, notes: "" }]);
  };

  const removeTopic = (index) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics.length > 0 ? updatedTopics : [{ name: "", completed: false, notes: "" }]);
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...resources];
    updatedResources[index][field] = value;
    setResources(updatedResources);
  };

  const addResource = () => {
    setResources([...resources, { name: "", url: "", type: "" }]);
  };

  const removeResource = (index) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    setResources(updatedResources.length > 0 ? updatedResources : [{ name: "", url: "", type: "" }]);
  };

  const toggleTopicComplete = async (progressId, topicName, completed) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:4043/api/learning-progress/${progressId}/topics/${topicName}`,
        null,
        {
          params: { completed },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProgressList(prev => prev.map(p => p.id === progressId ? response.data : p));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update topic status');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="learning-progress-container bg-gray-50 min-h-screen py-8">
      <div className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, description or topics..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <form 
        className="bg-white max-w-xl mx-auto rounded-lg shadow-md p-6 mb-8 border border-green-200" 
        onSubmit={formik.handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-6 text-green-700 border-b pb-2">
          {editId ? 'Edit Learning Progress' : 'Add Learning Progress'}
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Topics</label>
            <button
              type="button"
              onClick={addTopic}
              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Topic
            </button>
          </div>
          
          <div className="space-y-3">
            {topics.map((topic, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={topic.completed}
                    onChange={(e) => handleTopicChange(index, 'completed', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={topic.name}
                    onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                    placeholder="Topic name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    value={topic.notes}
                    onChange={(e) => handleTopicChange(index, 'notes', e.target.value)}
                    placeholder="Notes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    className="w-full inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Resources</label>
            <button
              type="button"
              onClick={addResource}
              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Resource
            </button>
          </div>
          
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={resource.name}
                    onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="url"
                    value={resource.url}
                    onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                    placeholder="URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <select
                    value={resource.type}
                    onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="">Type</option>
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Course">Course</option>
                    <option value="Document">Document</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="w-full inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Current Progress:</span>
            <span className="text-sm font-semibold text-green-700">
              {calculateProgress(topics.filter(t => t.name.trim() !== ""))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${calculateProgress(topics.filter(t => t.name.trim() !== ""))}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {editId ? 'Update Progress' : 'Add Progress'}
          </button>
          {editId && (
            <button
              type="button"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => { 
                setEditId(null); 
                formik.resetForm(); 
                setTopics([{ name: "", completed: false, notes: "" }]);
                setResources([{ name: "", url: "", type: "" }]);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {filteredProgress.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No matching learning progress found' : 'No learning progress records found. Create one to get started!'}
        </div>
      ) : (
        filteredProgress.map((progress) => (
          <ProgressCard
            key={progress.id}
            progress={progress}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={toggleTopicComplete}
          />
        ))
      )}
    </div>
  );
};

export default LearningProgress;
