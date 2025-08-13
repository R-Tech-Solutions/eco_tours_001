"use client"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'
import { NavbarLinks } from "./Navbar"

const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
  console.log("showMenu", showMenu)
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[80vw] max-w-xs flex-col justify-between bg-white/60 backdrop-blur-md text-black px-6 pb-6 pt-16 md:hidden rounded-r-3xl shadow-2xl border border-white/50`}
    >
      <div>
        <nav className="mt-8">
          <ul className="space-y-6 text-xl">
            {NavbarLinks.map((data, index) => (
              <li key={index}>
                <Link 
                  to={data.link} 
                  onClick={() => setShowMenu(false)} 
                  className="mb-5 inline-block hover:text-blue-200 font-extrabold text-lg"
                >
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>       
  )
}

ResponsiveMenu.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  setShowMenu: PropTypes.func.isRequired,
}

export default ResponsiveMenu

