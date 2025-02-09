import AllGroups from "../components/all_groups";
import RecentChat from "../components/recent_chat";

function Groups() {
    return (  
        <>
        <div className="flex justify-center h-screen mt-8 gap-24">
            <AllGroups />
            <RecentChat />
        </div>
        </>
    );
}

export default Groups;