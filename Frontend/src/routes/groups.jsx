import AllGroups from "../components/all_groups";
import RecentChat from "../components/recent_chat";

function Groups() {
    return (  
        <>
        <div className="flex flex-col gap-8 md:gap-24 items-center lg:justify-center h-full lg:h-screen mt-8  lg:flex-row lg:gap-24">
            <AllGroups />
            <RecentChat />
        </div>
        </>
    );
}

export default Groups;