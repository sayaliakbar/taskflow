import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, initializeAuth } from "../redux/authSlice";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth); // Get user from Redux store

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const [toggleDropdown, setToggleDropDown] = useState(false); // State for mobile dropdown

  // Handle logout
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    router.push("/login"); // Redirect to login page
  };

  // Paths where the Navbar should not be displayed

  const excludedPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isExcludedPath = excludedPaths.includes(router.pathname);

  // // If the current path is excluded, return null (don't render the Navbar)
  // if (isExcludedPath) {
  //   return null;
  // }

  return (
    <nav className="flex-between w-full mb-12 pt-3 text-white">
      {/* Logo and Home Link */}
      <Link className="flex gap-2 flex-center" href="/">
        <Image
          src="/logo.jpg"
          alt="Project Logo"
          width={30}
          height={30}
          className="object-contain rounded-full"
        />
        <p className="logo_text">Task Flow</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {token ? (
          // If user is logged in, show these buttons

          <div className="flex gap-3 md:gap-5">
            {user?.role === "admin" && (
              <>
                <Link href="/create-task" className="black_btn">
                  Create Task
                </Link>
                <Link href="/users" className="black_btn">
                  Users
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              type="button"
              className="outline_btn"
            >
              Log Out
            </button>

            <Link href="/profile">
              <Image
                src="/user-icon.jpg"
                alt="User Profile"
                width={37}
                height={37}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          // If user is not logged in, show login button
          <Link href="/login" className="black_btn">
            Log In
          </Link>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {token ? (
          // If user is logged in, show mobile dropdown
          <div className="flex">
            <Image
              src="/user-icon.jpg"
              alt="User Profile"
              width={37}
              height={37}
              className="rounded-full cursor-pointer"
              onClick={() => setToggleDropDown((prev) => !prev)}
            />

            {/* Dropdown Menu */}
            {toggleDropdown && (
              <div className="dropdown z-10">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropDown(false)}
                >
                  My Profile
                </Link>
                {user?.role === "admin" && (
                  <>
                    <Link
                      href="/create-task"
                      className="dropdown_link"
                      onClick={() => setToggleDropDown(false)}
                    >
                      Create Task
                    </Link>
                    <Link
                      href="/users"
                      className="dropdown_link"
                      onClick={() => setToggleDropDown(false)}
                    >
                      Users
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleLogout;
                    setToggleDropDown(false);
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          // If user is not logged in, show login button
          <Link href="/login" className="black_btn">
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
