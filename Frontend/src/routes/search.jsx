import { useState } from "react";
import { search_users } from "../api/endpoints";
import SearchUserInfo from "../components/seachUserInfo";

function Search() {
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const handleSearch = async () => {
        const usersData = await search_users(search)
        setUsers(usersData)
        console.log(usersData)
    }
    return ( 
        <>
        <div className="min-h-screen flex flex-col items-center mt-8 gap-4">
            <div className='h-full w-112 flex flex-col gap-4'>
                <h1 className="text-2xl font-bold w-86 max-w-96">Search Users</h1>
                <div className="flex gap-4 w-full">
                    <input onChange={(e) => setSearch(e.target.value)} type="text" className="bg-gray-100 w-full border-1 border-gray-300 rounded-sm p-2" />
                    <button onClick={handleSearch} className="bg-blue-500 text-lg text-white rounded-sm p-2 px-4 cursor-pointer">Search</button>
                </div>
                <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-2xl p-6 h-96">
                    {
                        users.map((user) => {
                            return <SearchUserInfo key={user.username} username={user.username} profile_image={user.profile_image} first_name={user.first_name} last_name={user.last_name}/>
                        })
                    }
                </div>
            </div>
        </div>
        </>
     );
}

export default Search;