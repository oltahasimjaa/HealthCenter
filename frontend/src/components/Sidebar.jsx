import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../components/ThemeContext";
import useAuthCheck from '../hook/useAuthCheck';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Calendar,  UserCircle2,  CheckSquare,  FileText,   Table,  FileInput,  MessageCircle,
    Mail, Menu,  ChevronDown,  Github, Trello,LogOut, ListCheck,Clipboard, Antenna,
  Users, Layers, Shield, CalendarClock, GraduationCap, ListOrdered, Package, Tags,
  ClipboardList, UserPlus, ShoppingCart,Star

} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0); // <-- Track cart items
  const { isChecking, user } = useAuthCheck(); 
  const navigate = useNavigate();
  const { theme } = useTheme();

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }
   const isOwner = user?.dashboardRole === 'Owner';
  // const isAdmin = user?.dashboardRole === 'Admin';
  const isSpecialist = ['Nutricionist', 'Fizioterapeut', 'Trajner', 'Psikolog'].includes(user?.role);
  // const isClient = user?.role === 'Client' && user?.dashboardRole === 'User';

  
  //  const AdminSpecialist = isAdmin || (isAdmin && isSpecialist);



  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5001/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMenuItemClick = (componentName) => {
    navigate(`/dashboard/${componentName}`);
  };

  const MenuItem = ({ icon: Icon, label, hasDropdown, componentName, externalLink, onClick }) => (
    <div 
      className={`relative flex flex-col items-start ${isOpen ? 'px-4' : ''} py-2 cursor-pointer text-lg
        hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700`}
        onClick={() => {
          if (externalLink && onClick) {
            onClick(); 
          } else if (!hasDropdown) {
            handleMenuItemClick(componentName);
          }
          if (hasDropdown) toggleDropdown(label);
        }}
      >
      <div className="flex items-center justify-between w-full">
        <div className={`flex items-center space-x-3 ${isOpen ? 'justify-start' : 'justify-center'} w-full`}>
          <Icon className="w-6 h-6 text-gray-500 dark:text-gray-300 group-hover:text-blue-700" />
          {isOpen && <span className="font-medium">{label}</span>}
        </div>
        {isOpen && hasDropdown && (
          <ChevronDown 
            className={`w-5 h-5 transition-transform ${openDropdown === label ? 'rotate-180' : ''}`} 
          />
        )}
      </div>
    </div>
  );

  return (
    <div className={`${isOpen ? 'w-72' : 'w-20'} bg-white dark:bg-gray-900 dark:text-white border-r h-screen overflow-auto transition-all duration-300 shadow-md flex flex-col justify-between`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div>
        <div className="px-4 py-4 border-b flex items-center justify-between">
          {isOpen && <span className="text-xl font-semibold">Wellness</span>}
          <button onClick={toggleSidebar} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="py-2 bg-white dark:bg-gray-900 dark:text-white">
          {isOpen && <div className="text-sm text-gray-400 px-4 py-2">MENU</div>}
          <MenuItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            componentName=""
          />
        
{(isSpecialist || isOwner) && (
        
    <div className="mb-1">
          <MenuItem 
              icon={Layers} 
              label="Manage Programs" 
              hasDropdown={true}
            />
                {openDropdown === 'Manage Programs' && isOpen && (
              <div className={`ml-12 mt-1 space-y-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-md p-1`}>
                <div 
                  className="flex items-center px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleMenuItemClick('program')}
                >
                  <Table className="w-5 h-5 mr-2" />
                  <span>Program</span>  
                </div>
                <div 
                  className="flex items-center px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleMenuItemClick('userprograms')}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span>UserPrograms</span>
                </div>

                <div 
                  className="flex items-center px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleMenuItemClick('list')}
                >
                  <ListOrdered  className="w-5 h-5 mr-2" />
                  <span>List</span>
                </div>


              </div>
            )}
        

        


          {/* Manage Users Dropdown */}
          {(isOwner || isSpecialist) && (

          <div className="mb-1">
            <MenuItem 
              icon={Users} 
              label="Manage Users" 
              hasDropdown={true}
            />
            {openDropdown === 'Manage Users' && isOpen && (
              <div className={`ml-12 mt-1 space-y-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-md p-1`}>
                <div 
                  className="flex items-center px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleMenuItemClick('users')}
                >
                  <Table className="w-5 h-5 mr-2" />
                  <span>Users</span>
                </div>
                <div 
                  className="flex items-center px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleMenuItemClick('createuser')}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span>Create User</span>
                </div>
              </div>
            )}
         
         




          <div className="mb-1">
            <MenuItem 
              icon={Shield} 
              label="Manage Roles" 
              hasDropdown={true}
            />
            {openDropdown === 'Manage Roles' && isOpen && (
              <div className={`ml-12 mt-1 space-y-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-md p-1`}>
                <div 
                  className="flex items-center px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleMenuItemClick('roles')}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  <span>Role</span>
                </div>
                <div 
                  className="flex items-center px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => handleMenuItemClick('dashboardrole')}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  <span>DashboardRole</span>
                </div>
              </div>
            )}
          </div>
          <div 
                className="flex items-center px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                onClick={() => handleMenuItemClick('scheduleTraining')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                <span>Schedule Training</span>
              </div>
 </div>
)}
      


          {/* Manage Orders Dropdown */}



         {/* <MenuItem 
            icon={ClipboardList} 
            label="Order" 
            componentName="order"
          /> */}
        

</div> )} 




           
          <MenuItem 
            icon={UserCircle2} 
            label="Profile" 
            componentName="profile"
          />

          

        

           <MenuItem 
            icon={MessageCircle} 
            label="Chat" 
            componentName="chat"
          />
          {/* shopping cart*/}
       
          
        </div>


        <div className="py-2 border-t bg-white dark:bg-gray-900 dark:text-white">
          {isOpen && <div className="text-sm text-gray-400 px-4 py-2">SUPPORT</div>}
          <MenuItem 
            icon={Github} 
            label="Repository" 
            externalLink={true}
            onClick={() => window.open("https://github.com/oltahasimjaa/HealthCenter", "_blank", "noopener,noreferrer")}
          />
          <MenuItem 
            icon={Trello} 
            label="Trello" 
            externalLink={true}
            onClick={() => window.open("_blank", "noopener,noreferrer")}
          />
        </div>
      </div>
      {/* <MenuItem 
            icon={CalendarClock} 
            label="Schedule" 
            componentName="schedule"
          /> */}

      <div className="p-4 border-t bg-white dark:bg-gray-900 dark:text-white">
        <button 
          onClick={handleLogout} 
          className="flex items-center w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          <LogOut className="w-6 h-6" />
          {isOpen && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;