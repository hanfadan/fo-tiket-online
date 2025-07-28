import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { cn } from "../lib/utils";
// import { useMediaQuery } from "react-responsive";//
import logo from "../assets/images/Logo MH.png";
// import Button from "./ui/Button";
import { RiUserSmileLine } from "react-icons/ri";
import { getCookies, removeCookies } from "../lib/cookie";
import fetchApi from "../lib/fetch-api";

type NavbarProps = {
  onClick: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onClick }) => {
  const location = useLocation();
  const authorization = getCookies("accessToken");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [showNavbar, setShowNavbar] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const storage = localStorage.getItem("users");
  const role = storage ? JSON.parse(storage) : null;

  // const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    if (authorization !== undefined) {
      setIsLogin(true);
    }
    window.scrollTo(0, 0);
  }, [location]);

  const handleLogout = async () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (!confirm) return;
    setIsLoading(true);
    const response = await fetchApi.post("/logout");
    if (response.status !== 204) {
      setIsLoading(false);
      return;
    }
    removeCookies("accessToken");
    setIsLoading(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        if (currentScrollY < 100) {
          setShowNavbar(true);
          return;
        }
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // const navigateToFaq = () => {
  //   if (location.pathname === "home") {
  //     navigate("/faq");
  //   } else {
  //     navigate("/#faq");
  //   }
  // };

  return (
    <nav
      className={cn(
        "top-10 rounded-full flex justify-center w-full sticky max-w-[1480px] mx-auto h-20 z-[999999] bg-white transition-transform duration-1000 ease-in-out text-slate-700",
        showNavbar ? "translate-y-0" : "-translate-y-[200%]"
      )}
    >
      <div className="flex items-center justify-between w-full h-full px-5 lg:px-10 max-w-screen-2xl">
        <div className="flex items-center justify-start gap-2">
          <button className="block text-2xl lg:hidden" onClick={onClick}>
            <GiHamburgerMenu />
          </button>
          <img src={logo} alt="" className="h-8 lg:h-10" />
        </div>

        <ul className="items-center justify-center hidden gap-10 lg:flex">
          <li className="text-lg font-medium ">
            <Link
              to="/"
              className={cn(
                location.pathname === "/" && "text-primary font-bold"
              )}
            >
              Home
            </Link>
          </li>
          <li className="text-lg font-medium ">
            <Link
              to="/event"
              className={cn(
                location.pathname === "/event" && "text-primary font-bold"
              )}
            >
              Event
            </Link>
          </li>
          <li className="text-lg font-medium ">
            <Link
              to="/galery"
              className={cn(
                location.pathname === "/galery" && "text-primary font-bold"
              )}
            >
              Galery
            </Link>
          </li>
          <li className="text-lg font-medium ">
            <a
              href="#faq"
              className={cn(
                location.pathname === "/information" && "text-primary font-bold"
              )}
            >
              Information
            </a>
          </li>
          <li className="text-lg font-medium ">
            <a
              href="#info"
              className={cn(
                location.pathname === "/contact" && "text-primary font-bold"
              )}
            >
              Contact
            </a>
          </li>
        </ul>
        {isLogin ? (
          <div className="relative w-10 h-10 border rounded-full cursor-pointer group min-w-10 hover:outline-8 outline-secondary outline">
            <RiUserSmileLine
              className={cn("w-full h-full", isLoading && "animate-spin")}
            />
            <div className="p-6 bg-white w-[16em] absolute right-0 group-hover:flex drop-shadow-xl shadow-xl border rounded-md hidden flex-col gap-4">
              <Link
                to={
                  role?.role === "admin"
                    ? "/dashboard/admin/events"
                    : "/dashboard/profile"
                }
              >
                <div className="px-4 py-1.5 lg:py-2 text-white rounded-full w-full bg-primary text-md flex justify-center">
                  Dashboard
                </div>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="px-4 py-1.5 lg:py-2 w-full text-white rounded-full bg-tertiary text-md cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/register">
              <button className="px-4 py-1.5 lg:py-2 text-white rounded-full bg-primary text-md">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="px-4 py-1.5 lg:py-2 text-white rounded-full bg-tertiary text-md">
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
