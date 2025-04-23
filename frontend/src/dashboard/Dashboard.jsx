import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Navbar from '../components/Navbar';
import useAuthCheck from '../hook/useAuthCheck';
 // Import the new component

// Import all components

import User from './Users/User';
import Profile from './Profile';
import CreateUser from './Users/CreateUser';
import EditUser from './Users/EditUser';
import Role from './Roles/Role';
import DashboardRole from './Roles/DashboardRole';

function Dashboard() {
  axios.defaults.withCredentials = true;
  const { isChecking, isAuthenticated, user } = useAuthCheck();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Role checks
  const isOwner = user?.dashboardRole === 'Owner';
  const isSpecialist = ['Nutricionist', 'Fizioterapeut', 'Trajner', 'Psikolog'].includes(user?.role);
  // const isAdmin = user?.dashboardRole === 'Admin';
  // const AdminSpecialist = isAdmin || (isAdmin && isSpecialist);
  const isClient = user?.role === 'Client' && user?.dashboardRole === 'User';

  const [activeComponent, setActiveComponent] = useState(() => {
    const pathParts = pathname.split('/');
    return pathParts.length > 2 ? pathParts[2] : localStorage.getItem('lastActiveComponent') || '';
  });

  // Define component access map
  const componentConfig = {
    // Public components (available to all authenticated users)
    profile: { component: <Profile />, access: true },
    
    
    // Owner only components
    users: { component: <User navigate={navigate} />, access: isSpecialist || isOwner },
    createuser: { component: <CreateUser navigate={navigate} />, access: isSpecialist || isOwner },
    edituser: { component: <EditUser navigate={navigate} />, access: isSpecialist || isOwner },
    roles: { component: <Role />, access: isOwner },
    dashboardrole: { component: <DashboardRole />, access: isOwner },
    
    // Admin, Specialist, or Owner components
   
    // Default component
    '': { component: <h1 className="text-2xl font-bold">Mirë se vini në Dashboard</h1>, access: true },
    null: { component: <h1 className="text-2xl font-bold">Mirë se vini në Dashboard</h1>, access: true },
    undefined: { component: <h1 className="text-2xl font-bold">Mirë se vini në Dashboard</h1>, access: true }
  };

  useEffect(() => {
    let isMounted = true; // Track mounted state

    const getActiveComponent = () => {
      const pathParts = pathname.split('/');
      return pathParts.length > 2 ? pathParts[2] : '';
    };

    const component = getActiveComponent();
    if (component && isMounted) {
      setActiveComponent(component);
      localStorage.setItem('lastActiveComponent', component);
    }

    if (pathname.startsWith('/dashboard/edituser/')) {
      const id = pathname.split('/')[3];
      localStorage.setItem('editUserId', id);
    }

    return () => {
      isMounted = false; // Cleanup
    };
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const config = componentConfig[activeComponent];
      if (config && !config.access) {
        navigate('/dashboard');
      }
    }

    return () => {
      isMounted = false;
    };
  }, [activeComponent, user, navigate]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Ju lutemi identifikohuni...</div>;
  }

  const renderComponent = () => {
    const config = componentConfig[activeComponent];
    
    if (config) {
   //   return config.access ? config.component : <AccessDenied />;
    }
    
    return <h1 className="text-2xl font-bold">Komponenti nuk u gjet</h1>;
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="bg-white dark:bg-gray-900 dark:text-white">
          <Sidebar />
        </div>
      
        <div className="p-6 flex-1 bg-gray-100 dark:bg-gray-800 overflow-auto h-screen" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;