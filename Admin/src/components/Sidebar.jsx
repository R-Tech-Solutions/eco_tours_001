import React, { useState } from "react";
import { Link } from "react-router-dom";

// Icons
import { LuBox, LuUser, LuMessageSquare, LuCalendar } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { CiUser } from "react-icons/ci";

// Icons//

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const handleLinkClick = (index) => {
    setActiveLink(index);
  };
  const SIDEBAR_LINKS = [
    { id: 1, path: "/", name: "Dashboard", icon: FaHome },
    { id: 2, path: "/addplace", name: "AddPlace", icon: CiUser },
    { id: 3, path: "/orders", name: "Orders", icon: LuMessageSquare },
    { id: 4, path: "/userAccess", name: "UserAccess", icon: LuUser },
    { id: 5, path: "/gellery", name: "Gellery", icon: LuBox },
    { id: 6, path: "/Posts", name: "Posts", icon: LuCalendar },
    { id: 7, path: "/Settings", name: "Setting", icon: LuCalendar },
    { id: 8, path: "/Front", name: "Front", icon: LuCalendar },
    { id: 9, path: "/UserDetails", name: "UserDetails", icon: LuCalendar },
  ];
  return (
    <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen pt-8 px-4 bg-gradient-to-b from-blue-50 to-indigo-100 overflow-y-auto">
      {/* Logo */}

      <div className="mb-8">
        <img src="/travel-logo.png" alt="logo" className="w-20 hidden md:flex" />
        <img src="/vite.svg" alt="logo" className="w-8 flex md:hidden" />
      </div>

      {/* Navigarion Links Start */}
      <ul className="mt-6 space-y-6">
        {SIDEBAR_LINKS.map((link, index) => (
          <li
            key={index}
            className={`font-medium rounded-md py-2 px-5 hover:bg-white/50 hover:text-indigo-600 transition-all duration-200 ${
              activeLink === index ? "bg-white/70 text-indigo-600 shadow-sm" : ""
            }`}
          >
            <Link
              to={link.path}
              className="flex justify-center md:justify-start items-center md:space-x-5"
              onClick={() => handleLinkClick(index)}
            >
              <span>{link.icon()}</span>
              <span className="text-sm text-gray-600 hidden md:flex">
                {link.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>




      {/* Navigarion Links End */}

      <div className="w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer text-center">
        
      </div>
    </div>
  );
};

export default Sidebar;
