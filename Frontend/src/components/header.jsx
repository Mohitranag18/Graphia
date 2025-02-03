import { useNavigate } from "react-router-dom";

function Header() {

    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`/${route}`)
    }

    return (  
        <>
        <div className="flex justify-between p-6 bg-blue-900 text-white">
            <div>Logo</div>
            <div className="flex gap-4">
                <p onClick={(route) => handleNavigate('')}>Home</p>
                <p onClick={(route) => handleNavigate('chat')}>Chat</p>
                <p onClick={(route) => handleNavigate('user/admin')}>Profile</p>
            </div>
        </div>
        </>
    );
}

export default Header;