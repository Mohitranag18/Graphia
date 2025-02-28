import { useState, useRef } from "react";
import { create_post } from "../api/endpoints";

function CreatePost() {
    const [description, setDescription] = useState('');
    const [postImage, setPostImage] = useState(null);
    const fileInputRef = useRef(null);

    const handlePost = async () => {
        if (!description || !postImage) {
            alert("Please add a description and an image.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", description);
            formData.append("post_image", postImage);

            const response = await create_post(formData); 

            if (response.success) {
                alert('Post created successfully');
                setDescription('');
                setPostImage(null);
                fileInputRef.current.value = ""; // Clear file input
            } else if (response.error) {
                alert(JSON.stringify(response.error));;
            }
        } catch (error) {
            alert("Error in creating post");
        }
    };

    return (
        <div className="h-screen flex justify-center">
            <div className="h-112 w-112 flex flex-col gap-4 mt-8">
                <h2 className="text-2xl font-bold">Create Post</h2>
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-lg font-semibold">Post Image</label>
                    <input
                        ref={fileInputRef}
                        onChange={(e) => setPostImage(e.target.files[0])}
                        accept="image/*"
                        type="file"
                        className="bg-gray-200 rounded-sm p-2"
                    />
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <label className="text-xl font-semibold">Description</label>
                    <input
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        type="text"
                        className="bg-gray-100 rounded-sm p-2 w-full border-1 border-gray-300"
                    />
                    <button
                        onClick={handlePost}
                        className="bg-blue-500 text-lg text-white cursor-pointer rounded-sm p-2"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
