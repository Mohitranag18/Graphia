import AllGroups from "../components/all_groups";
import CreateGroup from "../components/create_group";

function Groups() {
    return (  
        <>
        <div className="flex justify-center mt-8 gap-24">
            <div className="bg-gray-100 p-6 h-auto border-2 border-black rounded-md"><AllGroups /></div>
            <div className="bg-gray-100 p-6 h-auto border-2 border-black rounded-md"><CreateGroup /></div>
        </div>
        </>
    );
}

export default Groups;