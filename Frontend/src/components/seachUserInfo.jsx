import {SERVER_URL} from '../api/endpoints'
import BlankImage from '../assets/blank_profile_picture2.png'
import { useNavigate } from "react-router-dom";

function SearchUserInfo({username, profile_image, first_name, last_name}) {

    const nav = useNavigate()

    const handleNav = () => {
        nav(`/user/${username}`)
    }

    return ( 
        <>
        <div onClick={handleNav} className='cursor-pointer flex gap-4 w-full px-4 py-2 items-center rounded-sm bg-gray-100 border-2 border-gray-200'>
            <div>
                {
                    profile_image ?
                    <img src={`${SERVER_URL}${profile_image}`} alt="DP" className='h-12 w-12 object-cover object-top rounded-full border-2 border-gray-400' />
                    :
                    <img src={BlankImage} className='h-12 w-12 object-cover rounded-full border-2 border-gray-400'/>
                }
            </div>
            <div className='flex flex-col'>
                <h1 className='font-semibold text-lg'>{first_name} {last_name}</h1>
                <h2 className='text-lg'>{`@${username}`}</h2>
            </div>
        </div>
        </>
     );
}

export default SearchUserInfo;