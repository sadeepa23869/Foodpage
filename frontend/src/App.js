import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import LearningPlans from "./components/LearningPlansSection/LearningPlan";
import Navigation from "./components/Navigation/Navigation";
import HomeSection from "./components/HomeSection/HomeSection";
import ProfileSection from "./components/ProfileSection/ProfileSection";
import NotificationSection from "./components/NotificationSection/NotificationSection";
import MessageSection from "./components/MessageSection/MessageSection";
import ExploreSection from "./components/ExploreSection/ExploreSection";
import LearningProgress from "./components/LearningProgressSection/LearningProgress";
import AIChatbotSection from "./components/AIChatbotSection/AIChatbotSection";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import PostCard from "./components/HomeSection/PostCard";
import { getPosts, getFollowingPosts } from "./api";

function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile and posts when authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user profile
      fetch("http://localhost:4043/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Session expired or user not found");
          return res.json();
        })
        .then((userData) => {
          setUser(userData);
          setIsAuthenticated(true);
          fetchPosts(); // Fetch posts after user is authenticated
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("token");
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    const fetchPosts = async () => {
      setIsLoadingPosts(true);
      try {
        let response;
        if (currentSection === "home") {
          response = await getPosts();
        } else if (currentSection === "explore") {
          response = await getFollowingPosts();
        }
        
        // Ensure posts have proper media URLs
        const postsWithMedia = response.data.map(post => ({
          ...post,
          imageUrls: post.imageIds?.map(id => `/posts/media/${id}`) || [],
          videoUrl: post.videoId ? `/posts/media/${post.videoId}` : null
        }));
        
        setPosts(postsWithMedia);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    // Listen for profile updates from ProfileSection
    const handleProfileUpdated = (e) => {
      setUser(e.detail);
    };
    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, []);

  // Google OAuth: read token from URL and store it
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // Fetch posts based on current section
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      let response;
      if (currentSection === "home") {
        response = await getPosts();
      } else if (currentSection === "explore") {
        response = await getFollowingPosts();
      }
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Update session on login/signup
  const afterAuth = (token) => {
    localStorage.setItem("token", token);
    return fetch("http://localhost:4043/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        fetchPosts(); // Fetch posts after authentication
      });
  };

  const handleLogin = async (values) => {
    try {
      const res = await fetch("http://localhost:4043/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      await afterAuth(data.token);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleSignup = async (values) => {
    try {
      const res = await fetch("http://localhost:4043/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 409) {
        alert("Email already exists. Please use a different email.");
        return;
      }
      if (!res.ok) throw new Error("Signup failed");
      const data = await res.json();
      await afterAuth(data.token);
      setShowSignup(false);
    } catch (err) {
      alert("Signup failed: " + err.message);
    }
  };

  const handleGoogleSignup = async () => {
    const clientId = "715372036340-e4j5nagbqers9ocutat52l568cqt05vu.apps.googleusercontent.com";
    const redirectUri = window.location.origin + "/google-oauth-callback.html";
    const scope = "email profile openid";
    const state = Math.random().toString(36).substring(2);
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.open(
      oauthUrl,
      "GoogleSignUp",
      "width=500,height=600,left=200,top=100,status=no,scrollbars=yes,resizable=yes"
    );
    window.addEventListener("message", async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === "google-oauth-token" && event.data.token) {
        try {
          const res = await fetch("http://localhost:4043/api/auth/google-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: event.data.token })
          });
          if (!res.ok) throw new Error("Google signup failed");
          const data = await res.json();
          await afterAuth(data.token);
          setShowSignup(false);
          navigate("/");
        } catch (err) {
          alert("Google signup failed: " + err.message);
        }
      }
    }, { once: true });
  };

  const handleGoogleLogin = async () => {
    const clientId = "715372036340-e4j5nagbqers9ocutat52l568cqt05vu.apps.googleusercontent.com";
    const redirectUri = window.location.origin + "/google-oauth-callback.html";
    const scope = "email profile openid";
    const state = Math.random().toString(36).substring(2);
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.open(
      oauthUrl,
      "GoogleLogin",
      "width=500,height=600,left=200,top=100,status=no,scrollbars=yes,resizable=yes"
    );
    window.addEventListener("message", async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === "google-oauth-token" && event.data.token) {
        try {
          const res = await fetch("http://localhost:4043/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: event.data.token })
          });
          if (!res.ok) throw new Error("Google login failed");
          const data = await res.json();
          await afterAuth(data.token);
          setShowSignup(false);
          navigate("/");
        } catch (err) {
          alert("Google login failed: " + err.message);
        }
      }
    }, { once: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setShowSignup(false);
    setPosts([]);
  };

  // Refresh posts when section changes
  useEffect(() => {
    if (isAuthenticated && (currentSection === "home" || currentSection === "explore")) {
      fetchPosts();
    }
  }, [currentSection, isAuthenticated]);

  // Show signup page if not authenticated and showSignup is true
  if (!isAuthenticated && showSignup) {
    return <SignupPage onSignup={handleSignup} onGoogleSignup={handleGoogleSignup} onLogin={() => setShowSignup(false)} />;
  }
  // Show login page if not authenticated and showSignup is false
  if (!isAuthenticated && !showSignup) {
    return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onShowSignup={() => setShowSignup(true)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side: Navigation area */}
      <div className="w-1/4 p-5">
        <Navigation 
          user={user} 
          setCurrentSection={setCurrentSection} 
          currentSection={currentSection} 
          onLogout={handleLogout} 
        />
      </div>

      {/* Center: Content area */}
      <div className="flex-1 p-5 overflow-y-auto h-screen">
        {/* Render the relevant content based on the currentSection state */}
        {currentSection === "home" && (
          <div className="space-y-4">
            <HomeSection user={user} refreshPosts={fetchPosts} />
            {isLoadingPosts ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              posts.map(post => (
                <PostCard 
                      key={post.id} 
                      post={post} 
                      user={user} 
                      refreshPosts={fetchPosts} 
                />
              ))
            )}
          </div>
        )}
        {currentSection === "learning-plans" && <LearningPlans />}
        {currentSection === "learning-progress" && <LearningProgress />}
        {currentSection === "profile" && <ProfileSection user={user} />}
        {currentSection === "notifications" && <NotificationSection />}
        {currentSection === "messages" && <MessageSection />}
        {currentSection === "explore" && (
          <div className="space-y-4">
            <ExploreSection user={user} />
            {isLoadingPosts ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  user={user} 
                  refreshPosts={fetchPosts} 
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Right side: AI Chatbot only */}
      <div className="w-1/4 p-5 flex flex-col h-screen">
        <AIChatbotSection className="flex-1" />
      </div>
    </div>
  );
}

export default App;