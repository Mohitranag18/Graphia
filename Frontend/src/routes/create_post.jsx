import { useState, useRef } from "react";
import { create_post } from "../api/endpoints";
import { useToast } from "../context/ToastContext";

function CreatePost() {
    const [description, setDescription] = useState('');
    const [postImage, setPostImage] = useState(null);
    const fileInputRef = useRef(null);
    const { showToast } = useToast();

    const handlePost = async () => {
        if (!description || !postImage) {
            showToast("Please add a description and an image.", "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", description);
            formData.append("post_image", postImage);

            const response = await create_post(formData); 

            if (response.success) {
                showToast('Post created successfully', 'success');
                setDescription('');
                setPostImage(null);
                fileInputRef.current.value = ""; // Clear file input
            } else if (response.error) {
                showToast(response.error, 'error');
            }
        } catch (error) {
            showToast("Error creating post. Please try again.", "error");
        }
    };

    return (
        <div className="h-screen flex justify-center items-start pt-20 px-4 bg-slate-50">
            <div className="w-full max-w-lg flex flex-col gap-6 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <div className="text-center mb-2">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Post</h2>
                    <p className="text-sm text-slate-500 mt-2">Share something new with your friends</p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-semibold text-slate-600 ml-1">Post Image</label>
                    <input
                        ref={fileInputRef}
                        onChange={(e) => setPostImage(e.target.files[0])}
                        accept="image/*"
                        type="file"
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50 transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Caption</label>
                        <input
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            type="text"
                            placeholder="What's on your mind?"
                            className="bg-slate-50 rounded-xl p-4 w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                        />
                    </div>
                    <button
                        onClick={handlePost}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold cursor-pointer rounded-xl py-3.5 w-full hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
