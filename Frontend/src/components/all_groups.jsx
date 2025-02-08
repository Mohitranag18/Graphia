import React, { useEffect, useState } from 'react';
import { get_all_groups } from '../api/endpoints';
import GroupCard from './group_card';

function AllGroups() {

    const [allGroups, setAllGroups] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllGroups = async () => {
            try{
                const groups = await get_all_groups()
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

    return ( 
        <>
        <div className='flex flex-col gap-4'>
        <h2 className="text-2xl font-bold">Groups List</h2>
        <div className='flex flex-col gap-4'>
            {
                loading ?
                <p>Loading....</p>
                :
                allGroups.map((group)=>{
                    return <GroupCard id={group.id} group_name={group.group_name} description={group.description} />
                })
            }
        </div>
        </div>
        </>
     );
}

export default AllGroups;