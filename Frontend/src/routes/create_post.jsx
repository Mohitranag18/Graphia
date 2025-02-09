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
        <div className="h-screen flex justify-center">
            <div className='h-112 w-112 flex flex-col gap-4 mt-8'>
                <h2 className="text-2xl font-bold">Create Post</h2>
                <div className="flex flex-col gap-4 w-full">
                    <label className="text-xl font-semibold">Description</label>
                    <input onChange={(e) => setDescription(e.target.value)} type="text" className="bg-gray-100 rounded-sm p-2 w-full border-1 border-gray-300"/>
                    <button onClick={handlePost} className="bg-blue-500 text-lg text-white rounded-sm p-2">Post</button>
                </div>
            </div>
        </div>
        </>
     );
}

export default CreatePost;