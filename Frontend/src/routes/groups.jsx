import AllGroups from "../components/all_groups";
import CreateGroup from "../components/create_group";

function Groups() {
    return (  
        <>
        <div className="flex justify-between p-24">
        <AllGroups />
        <CreateGroup />
        </div>
        </>
    );
}

export default Groups;