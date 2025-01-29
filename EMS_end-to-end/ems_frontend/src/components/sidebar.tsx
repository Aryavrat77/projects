import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeOutlined, WorkOutline, PeopleOutline, PieChartOutline, Logout, Menu, ArrowDropDown } from '@mui/icons-material';
import { cn } from '@/lib/utils';
import UserProfile from './userProfile';
import axios from 'axios';
import { FormData } from "@/components/applicationInfo";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsDropdownOpen(false); // Close dropdown when toggling sidebar
  };

  const handleMouseEnter = () => {
    if (!isOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleDashboardClick = () => {
    // if (isOpen) {
    //   setIsDropdownOpen(!isDropdownOpen);
    // } else {
      router.push(`/dashboard?id=${localStorage.getItem('employeeId')}`);
    // }
  };

  return (
    <div className={`h-screen flex flex-col justify-between shadow-lg transition-all ${isOpen ? 'w-64' : 'w-16'}`}>
      <div>
        <button className="p-4 focus:outline-none" onClick={handleToggle}>
          <Menu />
        </button>
        <UserProfile />
        
        <nav className="mt-5">
          <ul className="space-y-4">
            <li 
              onMouseEnter={() => setIsDropdownOpen(true)} 
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div
                className={cn(
                  "relative flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg cursor-pointer",
                  pathname === "/dashboard" && "bg-blue-200 text-black"
                )}
                onClick={handleDashboardClick}
              >
                <HomeOutlined className="mr-3" />
                {isOpen && (
                  <>
                    Dashboard
                    <ArrowDropDown className="ml-1" />
                  </>
                )}
              </div>
              {isDropdownOpen && (
                <ul
                  className={`${
                    isOpen ? 'pl-12' : 'absolute left-16'
                  } bg-white shadow-lg rounded-lg space-y-2 z-10`}
                >
                  <li>
                    <Link href="/application-form" legacyBehavior>
                      <a className="block px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                        Application Form
                      </a>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/job-portal" legacyBehavior>
                <a
                  className={cn(
                    'flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg',
                    pathname === '/job-portal' && 'bg-blue-200 text-black'
                  )}
                >
                  <WorkOutline className="mr-3" />
                  {isOpen && 'Job Portal'}
                </a>
              </Link>
            </li>
            <li>
              <Link href="/my-teams" legacyBehavior>
                <a
                  className={cn(
                    'flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg',
                    pathname === '/my-teams' && 'bg-blue-200 text-black'
                  )}
                >
                  <PeopleOutline className="mr-3" />
                  {isOpen && 'My Teams'}
                </a>
              </Link>
            </li>
            <li>
              <Link href="/analytics" legacyBehavior>
                <a
                  className={cn(
                    'flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg',
                    pathname === '/analytics' && 'bg-blue-200 text-black'
                  )}
                >
                  <PieChartOutline className="mr-3" />
                  {isOpen && 'Analytics'}
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mb-4">
        <Link href="/logout" legacyBehavior>
          <a className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
            <Logout className="mr-3" />
            {isOpen && 'Logout'}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
