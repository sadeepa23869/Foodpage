import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [recipeCommunities, setRecipeCommunities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });

  // Sample data for chefs to connect with
  const chefsToConnect = [
    { id: 1, name: "Gordon Ramsay", food: "🍳 British Cuisine", skills: "Steak, Breakfast Dishes" },
    { id: 2, name: "Samin Nosrat", food: "🥗 Healthy Meals", skills: "Salads, Dressings" },
    { id: 3, name: "Massimo Bottura", food: "🍝 Italian Classics", skills: "Pasta, Sauces" },
    { id: 4, name: "Christina Tosi", food: "🍰 Desserts", skills: "Cakes, Cookies" },
  ];

  // Sample featured recipes
  const featuredRecipes = [
    {
      id: 1,
      title: "Perfect Breakfast Pancakes 🥞",
      description: "Fluffy, buttery pancakes ready in just 15 minutes. A must-try morning treat!",
      imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      author: "Gordon Ramsay",
      date: "New Today",
      location: "Online Kitchen"
    },
    {
      id: 2,
      title: "Homemade Spaghetti Carbonara 🍝",
      description: "An authentic Italian recipe with creamy sauce and crispy pancetta.",
      imageUrl: "https://images.unsplash.com/photo-1600628422011-8ab97e286d0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      author: "Massimo Bottura",
      date: "Trending",
      location: "Virtual Class"
    },
  ];

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "Chef");

    const fetchCommunities = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/communities");
        setRecipeCommunities(response.data);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/communities", newCommunity);
      setRecipeCommunities([...recipeCommunities, response.data]);
      setNewCommunity({ name: "", description: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 p-6 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-red-800 mb-2">
              Welcome back, <span className="text-orange-600">{username}</span>!
            </h1>
            <p className="text-lg text-gray-600">
              Discover new recipes, join foodie communities, and share your passion for cooking!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Chefs to Connect */}
            <div className="lg:w-1/4 w-full">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                  <span className="mr-2">👨‍🍳</span> Connect With Chefs
                </h2>
                <ul className="space-y-4">
                  {chefsToConnect.map((chef) => (
                    <li key={chef.id} className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="bg-red-100 text-red-800 rounded-full w-10 h-10 flex items-center justify-center mr-3 font-bold">
                          {chef.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-red-900">{chef.name}</h3>
                          <p className="text-sm text-red-700">{chef.food}</p>
                          <p className="text-xs text-gray-500 mt-1">{chef.skills}</p>
                        </div>
                      </div>
                      <button className="mt-3 w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-1 px-4 rounded-lg text-sm hover:from-red-700 hover:to-red-600 transition">
                        Connect
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center Column: Featured Recipes */}
            <div className="lg:w-2/4 w-full">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-red-800 mb-6 flex items-center">
                  <span className="mr-2">🍽️</span> Featured Recipes
                </h2>
                <div className="space-y-6">
                  {featuredRecipes.map((recipe) => (
                    <div key={recipe.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-red-900">{recipe.title}</h3>
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            {recipe.date}
                          </span>
                        </div>
                        <p className="text-gray-600 my-3">{recipe.description}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>📍 {recipe.location}</p>
                          <p>👨‍🍳 By {recipe.author}</p>
                        </div>
                        <div className="flex gap-3">
                          <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white py-2 rounded-lg hover:from-orange-600 hover:to-orange-500 transition">
                            View Recipe
                          </button>
                          <button className="flex-1 border border-orange-500 text-orange-600 py-2 rounded-lg hover:bg-orange-50 transition">
                            Save to Cookbook
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Recipe Communities */}
            <div className="lg:w-1/4 w-full">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-red-800 flex items-center">
                    <span className="mr-2">👥</span> Recipe Communities
                  </h2>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm px-3 py-1 rounded-lg hover:from-red-700 hover:to-red-600 transition"
                  >
                    {showForm ? 'Cancel' : '+ Create'}
                  </button>
                </div>

                {showForm && (
                  <form onSubmit={handleFormSubmit} className="mb-6 bg-red-50 p-4 rounded-lg">
                    <input
                      type="text"
                      placeholder="Community Name"
                      value={newCommunity.name}
                      onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                      className="w-full border border-gray-300 p-2 rounded mb-2"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={newCommunity.description}
                      onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                      className="w-full border border-gray-300 p-2 rounded mb-3"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-2 rounded-lg hover:from-orange-600 hover:to-orange-500 transition"
                    >
                      Create Community
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {recipeCommunities.map((community) => (
                    <div key={community.id} className="border border-red-100 rounded-lg p-4 hover:bg-red-50 transition">
                      <h3 className="font-semibold text-red-900">{community.name}</h3>
                      <p className="text-sm text-gray-600 my-2">{community.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-red-600">58 members</span>
                        <button 
                          onClick={() => navigate(`/community/${community.id}`)}
                          className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
