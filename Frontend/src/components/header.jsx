import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";







function Header() {

    const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`/${route}`)
    }
    const handleNavigateUser = () => {
        const username = JSON.parse(localStorage.getItem('userData'))['username']
        nav(`/user/${username}`)
        window.location.reload()
    }

    return (  
        <>
        <div className="flex justify-between items-center px-6 py-6 bg-emerald-800 text-white">
            <div className="font-bold text-xl">Graphia</div>
            <div className="flex gap-6 text-xl">
                <p onClick={(route) => handleNavigate('')}><AiOutlineHome /></p>
                <p onClick={(route) => handleNavigate('search')} className="text-2xl"><IoMdSearch /></p>
                <p onClick={(route) => handleNavigate('create/post')}><IoMdAddCircleOutline /></p>
                <p onClick={(route) => handleNavigate('groups')}><IoChatbubbleEllipsesOutline /></p>
                <p onClick={handleNavigateUser}><CgProfile /></p>
            </div>
        </div>
        </>
    );
}

export default Header;