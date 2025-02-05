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
        <div className="min-h-screen flex flex-col items-center mt-12 gap-4">
            <h1 className="text-2xl font-semibold">Search Users</h1>
            <div className="flex gap-4 w-86 max-w-96">
                <input onChange={(e) => setSearch(e.target.value)} type="text" className="bg-gray-200 rounded-sm p-2 w-full" />
                <button onClick={handleSearch} className="bg-blue-600 rounded-sm p-2">Search</button>
            </div>
            <div className="w-86 max-w-96 mt-4 flex flex-col gap-4 justify-center">
                {
                    users.map((user) => {
                        return <SearchUserInfo key={user.username} username={user.username} profile_image={user.profile_image} first_name={user.first_name} last_name={user.last_name}/>
                    })
                }
            </div>
        </div>
        </>
     );
}

export default Search;