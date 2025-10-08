
import React from 'react'
import { axiosInstance } from '../utils/axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore  } from '../utils/useAuthStore';
import { useChatStore } from '../utils/useChatStore';


const Navbar = () => {
  const {authUser , logout ,profileRoute} = useAuthStore();
  const {clearChatStore} = useChatStore();
  const navigate = useNavigate();
  const handleHome= (e)=>{
    e.preventDefault();
    navigate("/")
  }
  const handleProfile = (e) => {
  e.preventDefault();
  navigate("/profile");
};
  const handleLogout = async (e)=>{
      e.preventDefault();
      logout()
      navigate("/login")
      clearChatStore();
  }
  return (
    <div>
      <div className=" top-0 z-50 navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <a onClick={handleHome} className="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      <li onClick={handleProfile}><a>Profile</a></li>
      <li><button onClick={handleLogout}>Logout</button></li>
    </ul>
  </div>
</div>

    </div>
  )
}

export default Navbar
