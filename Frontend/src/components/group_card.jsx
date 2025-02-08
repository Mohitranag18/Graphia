function GroupCard({id, group_name, description}) {
    return (
        <>
        <div className="flex flex-col justify-center rounded-md bg-gray-100 p-2 px-4 w-86 h-20 overflow-hidden border-2 border-black cursor-pointer hover:bg-gray-200">
            <h3 className="font-bold text-lg">{group_name}</h3>
            <p className="text-gray-800">{description}</p>
        </div>
        </>
     );
}

export default GroupCard;