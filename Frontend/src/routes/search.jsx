import { useState, useEffect } from "react";
import { search_users } from "../api/endpoints";
import SearchUserInfo from "../components/seachUserInfo";
import { useDebounce } from "../hooks/useDebounce";

function Search() {
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const debouncedSearchTerm = useDebounce(search, 500);

    useEffect(() => {
        const handleSearch = async () => {
            if (debouncedSearchTerm) {
                const usersData = await search_users(debouncedSearchTerm)
                setUsers(usersData)
            } else {
                setUsers([])
            }
        }
        handleSearch();
    }, [debouncedSearchTerm]);

    return ( 
        <>
        <div className="min-h-screen flex flex-col items-center mt-8 gap-4 px-4 md:px-0">
            <div className='h-full w-full max-w-lg flex flex-col gap-4'>
                <h1 className="text-2xl font-bold w-full text-center md:text-left">Search Users</h1>
                <div className="flex flex-col gap-4 w-full">
                    <input 
                        onChange={(e) => setSearch(e.target.value)} 
                        type="text" 
                        value={search}
                        className="bg-gray-100 w-full border-1 border-gray-300 rounded-sm p-2" 
                        placeholder="Enter username to search..."
                    />
                </div>
                <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-2xl p-6 h-96 overflow-hidden overflow-y-auto custom-scrollbar">
                    {
                        users.map((user) => (
                            <SearchUserInfo 
                                key={user.username} 
                                username={user.username} 
                                profile_image={user.profile_image} 
                                first_name={user.first_name} 
                                last_name={user.last_name}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
        </>
    );
}

export default Search;
