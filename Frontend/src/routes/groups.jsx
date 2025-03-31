import AllGroups from "../components/all_groups";
import RecentChat from "../components/recent_chat";

function Groups() {
    return (  
        <>
        <div className="flex flex-col gap-8 md:gap-12 items-center lg:justify-center h-full min-h-screen my-8 lg:flex-row lg:gap-24 lg:items-start px-4">
            <AllGroups />
            <RecentChat />
        </div>
        </>
    );
}

export default Groups;
