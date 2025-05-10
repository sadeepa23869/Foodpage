import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Avatar, Button, Menu, MenuItem, Popover, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TagFacesIcon from '@mui/icons-material/TagFaces';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { 
    createComment, 
    getCommentsByPostId, 
    updateComment, 
    deleteComment 
} from "../../api";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxHeight: '80vh',
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 4,
    outline: "none",
    borderRadius: 4,
    overflowY: 'auto',
};

export default function CommentModal({ 
    open, 
    handleClose, 
    post = {}, 
    user = {} }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const openMenu = Boolean(anchorEl);
    const openEmojiPicker = Boolean(emojiAnchorEl);

    const formik = useFormik({
        initialValues: {
            content: "",
        },
        validationSchema: Yup.object({
            content: Yup.string().required('Comment cannot be empty'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);
            try {
                if (isEditing) {
                    await updateComment(editingCommentId, values.content);
                } else {
                    await createComment(post.id, values.content);
                }
                
                const { data } = await getCommentsByPostId(post.id);
                setComments(data);
                
                resetForm();
                setIsEditing(false);
                setEditingCommentId(null);
            } catch (error) {
                console.error("Comment error:", error.response?.data || error);
                alert(error.response?.data?.message || "Failed to submit comment");
            } finally {
                setIsSubmitting(false);
            }
        },
    });
    

    useEffect(() => {
        if (open && post?.id) {
            console.log('Loading comments for post:', post.id);
            loadComments();
        }
    }, [open, post?.id]);

    const loadComments = async () => {
        setIsLoadingComments(true);
        try {
            const response = await getCommentsByPostId(post.id);
            setComments(response.data);
            console.log('Comments loaded:', response.data);
        } catch (error) {
            console.error("Failed to load comments:", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleClickMenu = (event, commentId) => {
        setSelectedCommentId(commentId);
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteComment(selectedCommentId);
            const { data } = await getCommentsByPostId(post.id);
            setComments(data);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert(`Failed to delete comment: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsDeleting(false);
            handleCloseMenu();
        }
    };

    const handleEdit = () => {
        const commentToEdit = comments.find(c => c.id === selectedCommentId);
        if (commentToEdit) {
            formik.setFieldValue("content", commentToEdit.content);
            setEditingCommentId(commentToEdit.id);
            setIsEditing(true);
            handleCloseMenu();
        }
    };

    const handleOpenEmojiPicker = (event) => {
        setEmojiAnchorEl(event.currentTarget);
    };

    const handleCloseEmojiPicker = () => {
        setEmojiAnchorEl(null);
    };

    const handleEmojiSelect = (emoji) => {
        formik.setFieldValue("content", formik.values.content + emoji);
        handleCloseEmojiPicker();
    };

    const emojiData = [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
        "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "👍", "👎", "👌",
        "✌️", "🤞", "❤️", "🔥", "👏", "🙏"
    ];

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <div className="flex space-x-5">
                    <Avatar
                        onClick={() => navigate(`/profile/${post.userId}`)}
                        className="cursor-pointer"
                        alt={post.username}
                        src={post.userAvatar}
                    />

                    <div className="w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex cursor-pointer items-center space-x-2">
                                <span className="font-semibold">{post.username}</span>
                                <span className="text-gray-600">{post.userHandle} • {new Date(post.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-2">
                            <p className="mb-2 p-0">{post.content}</p>
                        </div>
                    </div>
                </div>

                <section className="py-10">
                    <div className="flex items-center space-x-5">
                        {/*<Avatar
                            alt={user?.name || 'User'}
                            src={user?.photo || "https://via.placeholder.com/150"}
                        />*/}
                        <div className="w-full">
                            <form onSubmit={formik.handleSubmit} className="flex flex-col">
                                <div>
                                    <input
                                        type="text"
                                        name="content"
                                        placeholder="Add a comment...."
                                        className="w-full px-4 py-3 text-gray-800 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        value={formik.values.content}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.content && formik.errors.content && (
                                        <span className="text-red-500 text-sm">
                                            {formik.errors.content}
                                        </span>
                                    )}
                                </div>
     

                                <div className="flex justify-between items-center mt-5">
                                    <div className="flex space-x-5 items-center">
                                        <TagFacesIcon 
                                            className="text-[#1d9bf0] cursor-pointer" 
                                            onClick={handleOpenEmojiPicker}
                                        />

                                        <Popover
                                            open={openEmojiPicker}
                                            anchorEl={emojiAnchorEl}
                                            onClose={handleCloseEmojiPicker}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                            }}
                                        >
                                            <Box sx={{ p: 2, width: 250 }}>
                                                <Box
                                                    sx={{
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(6, 1fr)",
                                                        gap: 1,
                                                    }}
                                                >
                                                    {emojiData.map((emoji, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                fontSize: "1.5rem",
                                                                cursor: "pointer",
                                                                textAlign: "center",
                                                                "&:hover": {
                                                                    backgroundColor: "rgba(0,0,0,0.04)",
                                                                    borderRadius: "4px",
                                                                },
                                                            }}
                                                            onClick={() => handleEmojiSelect(emoji)}
                                                        >
                                                            {emoji}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Popover>
                                    </div>

                                    <Button
                                        sx={{
                                            borderRadius: "16px",
                                            paddingY: "4px",
                                            paddingX: "12px",
                                            fontSize: "0.9rem",
                                            minWidth: "auto",
                                            bgcolor: "#1e88e5",
                                            textTransform: "none",
                                        }}
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting || !formik.values.content.trim()}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : isEditing ? "Update" : "Comment"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-10" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {isLoadingComments ? (
                            <div className="flex justify-center items-center h-20">
                                <CircularProgress />
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => {
                                

                                return (
                                    <div key={comment.id} className="flex space-x-3 items-start relative mb-4">
                                        <Avatar 
                                            alt={comment.username} 
                                            src={comment.userAvatar} 
                                            className="cursor-pointer"
                                            onClick={() => navigate(`/profile/${comment.userId}`)}
                                        />
                                        <div className="flex flex-col w-full">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold">{comment.username}</span>
                                                        <span className="text-gray-600">@{comment.userHandle}</span>
                                                        <span className="text-gray-500 text-sm">
                                                            • {new Date(comment.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-800 mt-1">{comment.content}</p>
                                                </div>
                                                
                                                
                                                {/* Only show menu if current user is the comment creator */}
                                                {user?.id === comment.userId && (
                                                    <div className="relative">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleClickMenu(e, comment.id);
                                                            }}
                                                            className="p-1 rounded-full hover:bg-gray-100"
                                                        >
                                                            <MoreHorizIcon className="text-gray-500" />
                                                        </button>
                                                        
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={openMenu && selectedCommentId === comment.id}
                                                            onClose={handleCloseMenu}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'right',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'right',
                                                            }}
                                                            sx={{
                                                                '& .MuiPaper-root': {
                                                                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                                                                    minWidth: '10px',
                                                                    zIndex: 9999
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem
                                                                onClick={handleEdit}
                                                                sx={{
                                                                    minHeight: "32px",
                                                                    padding: "0 8px",
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                }}>
                                                                <EditIcon sx={{ fontSize: "12px", color: "blue"}} />
                                                            </MenuItem>

                                                            <MenuItem
                                                                onClick={handleDelete}
                                                                sx={{
                                                                    minHeight: "32px",
                                                                    padding: "0 8px",
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                }}>
                                                                {isDeleting ? (
                                                                    <CircularProgress size={16} />
                                                                ) : (
                                                                    <DeleteIcon sx={{ fontSize: "12px", color: "red"}} />
                                                                )}
                                                            </MenuItem>
                                                        </Menu>
                                                    </div>
                                                )}
                                            
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-500 py-4">
                                No comments yet. Be the first to comment!
                            </div>
                        )}
                    </div>
                </section>
            </Box>
        </Modal>
    );
}