import axios from 'axios';

const API_BASE_URL = 'http://localhost:4043';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getPosts = () => api.get('/api/posts');
export const createPost = (content, images, video) => {
  const formData = new FormData();
  formData.append('content', content);
  if (images) {
    images.forEach((image) => formData.append('images', image));
  }
  if (video) {
    formData.append('video', video);
  }
  return api.post('/api/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getMediaUrl = (fileId) => {
  return `${API_BASE_URL}/api/posts/media/${fileId}`;
};

export const updatePost = (postId, content) => {
  return api.put(`/api/posts/${postId}`, { content });
};

export const likePost = (postId) => api.post(`/api/posts/${postId}/like`);
export const unlikePost = (postId) => api.post(`/api/posts/${postId}/unlike`);
export const deletePost = (postId) => api.delete(`/api/posts/${postId}`);
export const getFollowingPosts = () => api.get('/api/posts/following');
export const getRecommendedUsers = () => api.get('/api/users/recommendations');
export const followUser = (userId) => api.post(`/api/users/follow/${userId}`);
export const unfollowUser = (userId) => api.post(`/api/users/unfollow/${userId}`);

// Comment API functions

//Create Comment
export const createComment = async (postId, content) => {
  try {
    const response = await api.post('/api/comments', {
      postId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

//Get Comments for a Post
export const getCommentsByPostId = async (postId) => {
  try {
    const response = await api.get(`/api/comments/post/${postId}`);
    return response;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

//Update Comment
export const updateComment = async (commentId, content) => {
  try {
    const response = await api.put(`/api/comments/${commentId}`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

//Delete Comment
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};