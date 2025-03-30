import React, { useEffect, useState } from 'react';
import { get_all_groups } from '../api/endpoints';
import GroupCard from './group_card';
import { IoSearchSharp } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import CreateGroup from './create_group';


function AllGroups() {
    const [query, setQuery] = useState('')
    const [allGroups, setAllGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [isCreate, setIsCreate] = useState(false)

    useEffect(() => {
        const fetchAllGroups = async () => {
            try{
                const groups = await get_all_groups(query)
                setAllGroups(groups)
                console.log(groups)
            }catch{
                alert('error getting groups list')
            } finally{
                setLoading(false)
            }
            }
            fetchAllGroups()
    },[])

    const handleSearch = async () => {
        setIsCreate(false)
        try{
            const groups = await get_all_groups(query)
            setAllGroups(groups)
        }catch{
            alert('error getting groups list')
        }
    }

    const handleToggleCreate = () => {
        setIsCreate(prevIsCreate => !prevIsCreate);
    };

    return ( 
        <>
        <div className='h-full w-full md:h-112 md:w-112'>
        <div className='flex flex-col gap-4'>
            <h2 className="text-2xl font-bold">Groups</h2>
            <div className='flex items-center gap-2'>
                <input className='bg-gray-100 rounded-sm p-2 w-full border-1 border-gray-300'
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    required
                />
                <div onClick={handleSearch} className='bg-gray-200 p-2 text-2xl rounded-sm cursor-pointer'><IoSearchSharp /></div>
                <div onClick={handleToggleCreate} className='bg-gray-200 p-2 text-2xl rounded-sm cursor-pointer'>
                    {
                        isCreate?
                        <MdOutlineCancel />
                        :
                        <IoMdAddCircleOutline />
                    }
                    
                    </div>
            </div>
            <div className='flex flex-col gap-4 border-2 border-gray-300 rounded-2xl p-6 h-96 overflow-hidden overflow-y-auto custom-scrollbar'>
                { isCreate?
                    <CreateGroup/>
                :
                    
                    loading ?
                    <p>Loading....</p>
                    :
                    allGroups.map((group)=>{
                        return <GroupCard id={group.id} group_name={group.group_name} slug={group.slug} description={group.description} />
                    })
                    
                }
            </div>
        </div>
        </div>
        </>
     );
}

export default AllGroups;