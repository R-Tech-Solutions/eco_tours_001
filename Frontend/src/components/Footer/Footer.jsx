import { useEffect, useState } from "react";
import FooterLogoImg from "../../assets/plc/img3.jpg";
import { BackendUrl } from "../../BackendUrl";
import { Link } from "react-router-dom";
import { NavbarLinks } from "../Navbar/Navbar";



const Footer = () => {
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    fetch(`${BackendUrl}/api/contact/`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contact_number) {
          setContactNumber(data.contact_number);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch contact number", err);
      });
  }, []);

  return (
    <>
      <footer className="bg-black text-white lg:grid lg:grid-cols-5 relative z-[10001]">
        <div className="relative block h-32 lg:col-span-2 lg:h-full">
          <img
            src={FooterLogoImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />

          
        </div>

        <div className="px-4 py-16 sm:px-6 lg:col-span-3 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <p>
                <span className="text-xs tracking-wide text-gray-300 uppercase">
                  Call us
                </span>

                <a
                  href={`tel:${contactNumber}`}
                  className="block text-2xl font-medium hover:opacity-75 sm:text-3xl"
                >
                  {contactNumber ? contactNumber : "+94 76 977 0470"}
                </a>
              </p>

            

              {/* Removed social links */}
            </div>

            {/* Footer navigation using NavbarLinks */}
            <div>
              <p className="font-medium">Navigation</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-300">
                {NavbarLinks.map((item) => (
                  <li key={item.name}>
                    <Link to={item.link} className="transition hover:opacity-75">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Removed bottom legal links; keep copyright */}
          <div className="mt-12 border-t border-gray-800 pt-12">
            <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()}. R-Tech Solutions. All rights reserved.
              </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;