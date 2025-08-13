"use client";

import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import FooterLogo from "../../assets/plc/travel-logo.png";
import { BackendUrl } from "../../BackendUrl";
import axios from "axios";
import PropTypes from 'prop-types';

export const NavbarLinks = [
	{
		name: "Home",
		link: "/",
	},
	{
		name: "Service",
		link: "/Service",
	},
	{
		name: "Blog",
		link: "/Blog",
	},
	{
		name: "Gallery",
		link: "/gellery",
	},
];

const Navbar = ({ showMenu, setShowMenu }) => {
	const [scrolled, setScrolled] = useState(false);
	const [logoImage, setLogoImage] = useState(null);
	const [logoLoading, setLogoLoading] = useState(true);

	// Fetch logo from API
	useEffect(() => {
		const fetchLogo = async () => {
			try {
				setLogoLoading(true);
				// Fetch only company_logo from dedicated endpoint
				const response = await axios.get(`${BackendUrl}/api/front/`);
				const items = Array.isArray(response.data) ? response.data : [];
				const first = items[0];
				const logoPath = first?.company_logo;
				if (logoPath) {
					const isAbsolute = /^https?:\/\//i.test(logoPath);
					setLogoImage(isAbsolute ? logoPath : `${BackendUrl}${logoPath}`);
				} else {
					setLogoImage(null);
				}
			} catch (error) {
				console.error('Error fetching logo:', error);
			} finally {
				setLogoLoading(false);
			}
		};

		fetchLogo();
	}, []);

	// Track scroll position to add shadow
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const toggleMenu = () => {
		setShowMenu(!showMenu);
	};

	return (
		<>
			<nav
				className={`fixed top-0 left-0 w-full h-[85px] z-[9999] bg-transparent backdrop-blur-sm text-black font-bold transition-all duration-300 ${
					scrolled ? "shadow-lg shadow-black/50" : ""
				}text-xl`}
			>
				<div className="container1 py-4 sm:py-2 relative">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4 font-bold text-2xl px-2 absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
							<Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
								{logoLoading ? (
									<div className="h-[80px] w-[80px] flex items-center justify-center">
										<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
									</div>
								) : logoImage ? (
									<img
										src={logoImage}
										alt="Company Logo"
										className="h-[80px] w-auto"
										onError={(e) => {
											console.error('Error loading logo image:', e);
											e.target.src = FooterLogo;
										}}
									/>
								) : (
									<img
										src={FooterLogo}
										alt="Company Logo"
										className="h-[80px] w-auto"
									/>
								)}
							</Link>
						</div>
						
						{/* Desktop Navigation with Animated Outline - Far Right Side */}
						<div className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
							<div className="nav">
								<div className="container1">
									{NavbarLinks.map((link) => (
										<NavLink
											key={link.name}
											to={link.link}
											className="btn"
											onClick={() => window.scrollTo(0, 0)}
										>
											{link.name}
										</NavLink>
									))}
									<svg
										className="outline"
										overflow="visible"
										width="450"
										height="60"
										viewBox="0 0 450 60"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											className="rect"
											pathLength="100"
											x="0"
											y="0"
											width="450"
											height="60"
											fill="transparent"
											strokeWidth="5"
										></rect>
									</svg>
								</div>
							</div>
						</div>

						{/* Mobile Menu Button */}
						<div className="flex items-center gap-4 px-2 md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
							<div className="block">
								{showMenu ? (
									<HiMenuAlt1
										onClick={toggleMenu}
										className="cursor-pointer transition-all"
										size={30}
									/>
								) : (
									<HiMenuAlt3
										onClick={toggleMenu}
										className="cursor-pointer transition-all"
										size={30}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
				<ResponsiveMenu setShowMenu={setShowMenu} showMenu={showMenu} />
			</nav>
			
			<style>{`
				.outline {
					position: absolute;
					inset: 0;
					pointer-events: none;
				}

				.rect {
					stroke-dashoffset: 5;
					stroke-dasharray: 0 0 10 40 10 40;
					transition: 0.5s;
					stroke: #000;
				}

				.nav {
					position: relative;
					width: 450px;
					height: 60px;
					z-index: 1000;
				}

				.container1:hover .outline .rect {
					transition: 999999s;
					stroke-dashoffset: 1;
					stroke-dasharray: 0;
				}

				.container1 {
					position: absolute;
					inset: 0;
					background: rgba(190, 255, 255, 0.1);
					display: flex;
					flex-direction: row;
					justify-content: space-around;
					align-items: center;
					padding: 0.5em;
					border-radius: 8px;
					z-index: 1001;
				}

				.btn {
					padding: 0.5em 1.2em;
					color: #000;
					cursor: pointer;
					transition: 0.1s;
					border-radius: 4px;
					text-decoration: none;
					font-weight: 700;
					font-size: 0.9rem;
					position: relative;
					z-index: 1002;
				}

				.btn:hover {
					background: rgba(0, 0, 0, 0.1);
				}

				.btn:nth-child(1):hover ~ svg .rect {
					stroke-dashoffset: 0;
					stroke-dasharray: 0 2 8 82.5 8 12.5;
				}

				.btn:nth-child(2):hover ~ svg .rect {
					stroke-dashoffset: 0;
					stroke-dasharray: 0 14.2 9.5 55.5 9.5 35.5;
				}

				.btn:nth-child(3):hover ~ svg .rect {
					stroke-dashoffset: 0;
					stroke-dasharray: 0 27.6 8.5 31 8.5 62.5;
				}

				.btn:nth-child(4):hover ~ svg .rect {
					stroke-dashoffset: 0;
					stroke-dasharray: 0 39 6.9 11.5 6.9 85.5;
				}

				.btn:hover ~ .outline .rect {
					stroke-dashoffset: 0;
					stroke-dasharray: 0 0 10 40 10 40;
					transition: 0.5s !important;
				}
			`}</style>
		</>
	);
};

Navbar.propTypes = {
	showMenu: PropTypes.bool.isRequired,
	setShowMenu: PropTypes.func.isRequired,
};

export default Navbar;
