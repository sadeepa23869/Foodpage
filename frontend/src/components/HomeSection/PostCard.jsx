import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {
  ChatBubbleOutline,
  Repeat,
  FavoriteBorder,
  Favorite,
  Share,
  Edit,
  MoreVert,
} from "@mui/icons-material";
import {
  likePost,
  unlikePost,
  deletePost,
  updatePost
} from "../../api";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, TextField } from "@mui/material";
import CommentModal from "./CommentModal";

const PostCard = ({ post, user, refreshPosts }) => {
  const [isLiked, setIsLiked] = useState(post.likedBy.includes(user?.id));
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = async () => {
    try {
      setIsSubmitting(true);
      await updatePost(post.id, editedContent);
      await refreshPosts();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    } finally {
      setIsSubmitting(false);
      handleMenuClose();
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setLikeCount(likeCount - 1);
      } else {
        await likePost(post.id);
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id);
        refreshPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        handleMenuClose();
      }
    }
  };

 

  const handleCommentModalOpen = () => {
    setOpenCommentModal(true);
  };

  const handleCommentModalClose = () => {
    setOpenCommentModal(false);
  };

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        <Avatar 
          src={post.user?.photo || "https://via.placeholder.com/150"} 
          alt={post.user?.name}
          onClick={() => navigate(`/profile/${post.userId}`)}
          className="cursor-pointer hover:opacity-80"
          sx={{ width: 48, height: 48 }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-1">
              <span className="font-bold hover:underline cursor-pointer">
                {post.user?.name}
              </span>
              <span className="text-gray-500 text-sm">
                @{post.user?.email.split('@')[0]}
              </span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            
            {user?.id === post.userId && (
              <>
                <IconButton onClick={handleMenuOpen} size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => {
                    setIsEditing(true);
                    setEditedContent(post.content);
                    handleMenuClose();
                  }}>
                    <Edit fontSize="small" className="mr-2" />
                    Edit Post
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    <span className="text-red-500">Delete Post</span>
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 mb-3">
              <TextField
                fullWidth
                multiline
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                variant="outlined"
                size="small"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleEditPost}
                  disabled={isSubmitting || !editedContent.trim()}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 mb-2 text-gray-800">{post.content}</p>
          )}
          
            {post.imageUrls?.length > 0 && (
              <div className={`grid gap-2 mb-3 ${
                post.imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}>
                {post.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={`http://localhost:4043${url}`} // Add the base URL
                      alt={`Post ${post.id} image ${index}`}
                      className="rounded-lg object-cover w-full h-48 hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/500x300?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {post.videoUrl && (
              <div className="mb-3">
                <video 
                  src={`http://localhost:4043${post.videoUrl}`} // Add the base URL
                  controls 
                  className="rounded-lg w-full"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/500x300?text=Video+Not+Available";
                  }}
                />
              </div>
            )}
          
          {/* Post actions */}
          <div className="flex justify-between mt-3 text-gray-500">
        <button 
          className="flex items-center space-x-1 hover:text-blue-500"
          onClick={handleCommentModalOpen} // open comment modal
        >
          <ChatBubbleOutline fontSize="small" />
          <span>{post.comments?.length || 0}</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-green-500">
              <Repeat fontSize="small" />
            </button>
            <button 
              className="flex items-center space-x-1 hover:text-red-500"
              onClick={handleLike}
            >
              {isLiked ? (
                <Favorite fontSize="small" color="error" />
              ) : (
                <FavoriteBorder fontSize="small" />
              )}
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <Share fontSize="small" />
            </button>
          </div>
          
          {/* Render your CommentModal */}
      <CommentModal 
        open={openCommentModal} 
        handleClose={handleCommentModalClose}
        // Pass any additional props your modal needs
        post={post}
        user={user}
        onCommentSubmit={(comment) => {
          // Handle comment submission if needed
          setCommentContent("");
          refreshPosts();
        }}
      />
        </div>
      </div>
    </div>
  );
};

export default PostCard;