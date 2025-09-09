import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { LuBox, LuUser, LuMessageSquare, LuCalendar } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { CiUser } from "react-icons/ci";

// Icons//

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const navigate = useNavigate();
  const SIDEBAR_LINKS = [
    // Removed Dashboard page
    // { id: 1, path: "/", name: "Dashboard", icon: FaHome },
    { id: 2, path: "/addplace", name: "AddPlace", icon: CiUser },
    { id: 3, path: "/orders", name: "Orders", icon: LuMessageSquare },
    { id: 4, path: "/userAccess", name: "UserAccess", icon: LuUser },
    { id: 5, path: "/gellery", name: "Gellery", icon: LuBox },
    { id: 6, path: "/Posts", name: "Posts", icon: LuCalendar },
    { id: 7, path: "/Settings", name: "Setting", icon: LuCalendar },
    { id: 8, path: "/Front", name: "Front", icon: LuCalendar },
    { id: 9, path: "/UserDetails", name: "UserDetails", icon: LuCalendar },
  ];

  // Optional: handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("login");
    navigate("/login");
  };

  return (
    <div className="card w-56 bg-white p-5 shadow-md shadow-purple-200/50 rounded-md min-h-screen flex flex-col items-center fixed left-0 top-0 z-10 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <img src="/travel-logo.png" alt="logo" className="w-20 mb-2" />
      </div>
      <ul className="w-full flex flex-col gap-2">
        {SIDEBAR_LINKS.map((link, index) => (
          <li
            key={link.id}
            className="flex-center cursor-pointer w-full whitespace-nowrap"
          >
            <Link
              to={link.path}
              className={`p-16-semibold flex w-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear items-center ${
                activeLink === index
                  ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                  : ""
              }`}
              onClick={() => setActiveLink(index)}
              tabIndex={0}
            >
              <span className="icon glyph size-6 group-focus:fill-white group-focus:stroke-white">
                {React.createElement(link.icon, { size: 24 })}
              </span>
              <span className="">{link.name}</span>
            </Link>
          </li>
        ))}
        {/* Settings Button Example */}
        <li className="flex-center cursor-pointer w-full whitespace-nowrap">
          <Link
            to="/Settings"
            className="p-16-semibold flex w-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear items-center"
            tabIndex={0}
          >
            <svg
              stroke="#000000"
              className="icon glyph size-6 group-focus:fill-white group-focus:stroke-white"
              id="dashboard-alt"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#000000"
              width={24}
              height={24}
            >
              <g strokeWidth="0"></g>
              <g strokeLinejoin="round" strokeLinecap="round"></g>
              <g>
                <path d="M14,10V22H4a2,2,0,0,1-2-2V10Z"></path>
                <path d="M22,10V20a2,2,0,0,1-2,2H16V10Z"></path>
                <path d="M22,4V8H2V4A2,2,0,0,1,4,2H20A2,2,0,0,1,22,4Z"></path>
              </g>
            </svg>
            Settings
          </Link>
        </li>
        {/* Logout Button Example */}
        <li className="flex-center cursor-pointer w-full whitespace-nowrap">
          <button
            className="p-16-semibold flex w-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear items-center"
            onClick={handleLogout}
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="size-6"
              width={24}
              height={24}
            >
              <g strokeWidth="0"></g>
              <g strokeLinejoin="round" strokeLinecap="round"></g>
              <g>
                <path
                  className="group-focus:fill-white"
                  fill="#000000"
                  d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z"
                ></path>
                <path
                  className="group-focus:fill-white"
                  fill="#000"
                  d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z"
                ></path>
              </g>
            </svg>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
