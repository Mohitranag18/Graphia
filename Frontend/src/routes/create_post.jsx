import { useState } from "react";
import { create_post } from "../api/endpoints";

function CreatePost() {

    const [description, setDescription] = useState('')

    const handlePost = async () => {
        try{
            await create_post(description)
        } catch{
            alert('error in creating post')
        }
    }

    return ( 
        <>
        <div className="min-h-screen p-8 flex justify-center mt-36">
            <div className="flex flex-col gap-6 w-86 max-w-96">
                <h2 className="text-2xl font-semibold mx-auto">Create Post</h2>
                <label className="text-xl font-semibold">Description</label>
                <input onChange={(e) => setDescription(e.target.value)} type="text" className="bg-gray-200 rounded-sm p-2"/>
                <button onClick={handlePost} className="bg-blue-600 rounded-sm p-2">Post</button>
            </div>
        </div>
        </>
     );
}

export default CreatePost;