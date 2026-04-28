import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from "../context/useAuth";
import { useNotifications } from "../context/NotificationContext";

function Header() {
    const nav = useNavigate();
    const { logoutUser } = useAuth();
    const { unreadMessageCount } = useNotifications();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavigate = (route) => {
        nav(`/${route}`)
    }
    
    const handleNavigateUser = () => {
        const username = JSON.parse(localStorage.getItem('userData'))['username']
        nav(`/user/${username}`)
        window.location.reload()
    }

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await logoutUser();
    };

    return (  
        <>
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-white/80 backdrop-blur-md text-slate-800 shadow-sm border-b border-slate-100 z-50 transition-all duration-300">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('')}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-indigo-500/30">
                    G
                </div>
                <span className="font-extrabold text-xl sm:text-2xl bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent tracking-tight hidden sm:block">Graphia</span>
            </div>
            <div className="flex gap-4 sm:gap-6 text-xl sm:text-2xl items-center text-slate-600">
                <p onClick={(route) => handleNavigate('')} className="cursor-pointer hover:text-indigo-600 hover:scale-110 transition-all duration-200"><AiOutlineHome /></p>
                <p onClick={(route) => handleNavigate('search')} className="cursor-pointer hover:text-indigo-600 hover:scale-110 transition-all duration-200"><IoMdSearch /></p>
                <p onClick={(route) => handleNavigate('create/post')} className="cursor-pointer hover:text-indigo-600 hover:scale-110 transition-all duration-200"><IoMdAddCircleOutline /></p>
                <div onClick={() => handleNavigate('chat')} className="cursor-pointer relative flex items-center hover:text-indigo-600 hover:scale-110 transition-all duration-200">
                    <IoChatbubbleEllipsesOutline />
                    {unreadMessageCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center leading-none">
                            {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                        </span>
                    )}
                </div>
                <NotificationDropdown />
                
                <div className="relative" ref={dropdownRef}>
                    <p onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="cursor-pointer flex items-center gap-1 hover:text-indigo-600 hover:scale-110 transition-all duration-200">
                        <CgProfile />
                    </p>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-4 w-40 bg-white rounded-md shadow-xl py-1 z-50 text-gray-800 text-sm border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    handleNavigateUser();
                                }}
                                className="block w-full text-left px-4 py-2.5 hover:bg-gray-100 transition font-medium"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-100 transition font-medium border-t border-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default Header;