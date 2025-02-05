import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { update_user } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

function EditProfile() {
    const nav = useNavigate();

    const { user, logoutUser } = useAuth();
    const storage = JSON.parse(localStorage.getItem('userData'))

    const [username, setUsername] = useState(storage ? storage.username : '')
    const [email, setEmail] = useState(storage ? storage.email : '')
    const [firstName, setFirstName] = useState(storage ? storage.first_name : '')
    const [lastName, setLastName] = useState(storage ? storage.last_name : '')
    const [bio, setBio] = useState(storage ? storage.bio : '')
    const [profileImage, setProfileImage] = useState(storage ? storage.profile_image : '')

    const handleUpdate = async () => {
        try{
            await update_user({"username":username, "profile_image":profileImage, "email":email, "bio":bio, "first_name":firstName, "last_name":lastName})
            localStorage.setItem("userData", JSON.stringify({"username":username, "email":email, "bio":bio, "first_name":firstName, "last_name":lastName}))
            alert("successfully updated details")
            nav(`/user/${username}`)
        } catch{
            alert("error updating details")
        }
    }

    const handleLogout = async () => {
        await logoutUser();
      };

    return ( 
        <>
        <div className="min-h-screen flex justify-center p-8">
            <div className="w-86 max-w-96 flex flex-col gap-6">
                <h1 className="text-2xl font-semibold mx-auto">Edit Profile</h1>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-lg font-semibold">Profile Picture</label>
                        <input onChange={(e) => setProfileImage(e.target.files[0])} type="file" className="bg-gray-200 rounded-sm p-2"/>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-lg font-semibold">Username</label>
                        <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className="bg-gray-200 rounded-sm p-2"/>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-lg font-semibold">Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="bg-gray-200 rounded-sm p-2"/>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-lg font-semibold">First Name</label>
                        <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" className="bg-gray-200 rounded-sm p-2"/>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-lg font-semibold">Last Name</label>
                        <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" className="bg-gray-200 rounded-sm p-2"/>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-lg font-semibold">Bio</label>
                        <textarea onChange={(e) => setBio(e.target.value)} value={bio} type="text" className="bg-gray-200 rounded-sm p-2"/>
                    </div>
                    <button onClick={handleUpdate} className="bg-blue-600 rounded-sm p-2">Save Changes</button>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-200"
                >
                    Logout
                </button>
            </div>
        </div>
        </>
     );
}

export default EditProfile;