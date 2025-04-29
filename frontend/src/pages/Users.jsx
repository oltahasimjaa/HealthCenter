import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import DeleteConfirmation from "../components/DeleteConfirmation";

import { saveAs } from 'file-saver';

const User = ({ setActiveComponent }) => {
  const { theme } = useTheme();
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemNameToDelete, setItemNameToDelete] = useState("");
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
    const navigate = useNavigate();
  

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async (roleId = "all", search = "") => {
    let url = "http://localhost:5001/api/user";
    
    if (roleId !== "all") {
      url = `http://localhost:5001/api/user/role/${roleId}`;
    }
    
    try {
      const response = await axios.get(url);
      
      if (search) {
        const filteredUsers = response.data.filter(user => 
          user.username.toLowerCase().includes(search.toLowerCase())
        );
        setUserList(filteredUsers);
      } else {
        setUserList(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    const response = await axios.get("http://localhost:5001/api/role");
    setRoleList(response.data);
  };


  
  
  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(selectedRole, searchTerm);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);
    fetchUsers(roleId, searchTerm);
    setCurrentPage(1); 
  };

  const handleDeleteClick = (id, name) => {
    setItemToDelete(id);
    setItemNameToDelete(name);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await axios.delete(`http://localhost:5001/api/user/${itemToDelete}`);
      fetchUsers();
      setDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleEditClick = (user) => {
    setEditingId(user.mysqlId || user.id);
    setEditFormData({
      name: user.name,
      lastName: user.lastName,
      number: user.number,
      email: user.email,
      username: user.username,
      country: user.country,
      city: user.city,
      birthday: user.birthday,
      gender: user.gender,
      roleId: user.roleId?.mysqlId || user.roleId
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleSaveClick = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/user/${id}`, editFormData);
      setEditingId(null);
      fetchUsers();
      navigate('/dashboard/users');
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(userList.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

    // Export functions
 

    const exportToCSV = () => {
      if (userList.length === 0) return;
    
      const filteredUserList = userList.map(({ password, profileImage, __v, roleId, ...rest }) => ({
        ...rest,
        role: roleId?.name || "No Role Assigned"
      }));
    
      // Create CSV headers
      const headers = Object.keys(filteredUserList[0]).join(',');
    
      // Create CSV rows
      const rows = filteredUserList.map(obj => 
        Object.values(obj)
          .map(value => `"${value?.toString().replace(/"/g, '""') || ''}"`)
          .join(',')
      );
    
      // Combine and create file
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, "users.csv");
      setShowDownloadDropdown(false);
    };
    
    const exportToJSON = () => {
      if (userList.length === 0) return;
    
      const filteredUserList = userList.map(({ password, profileImage , __v , roleId, ...rest }) => ({
        ...rest,
        role: roleId && roleId.name ? roleId.name : "No Role Assigned"
      }));
    
      const jsonContent = JSON.stringify(filteredUserList, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      saveAs(blob, "users.json");
      setShowDownloadDropdown(false);
    };

  return (
    <div className="h-screen flex flex-col">
      {/* <Navbar /> */}
      <div className="flex flex-1 mb-[2rem]">
        {/* <Sidebar /> */}
        <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className={`flex justify-center items-center min-h-screen ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className={`shadow-xl rounded-lg pt-8 p-2 w-full max-w-10xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-8">
                <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>User Management</h1>
                
                <div className="flex items-center space-x-4">
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search by username..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        fetchUsers(selectedRole, e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`border p-2 rounded-lg text-lg shadow-sm ${theme === 'dark' ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'}`}
                    />
                    
                    <div className="relative ml-2">
                      <button 
                        type="button"
                        onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                        className={`flex items-center justify-center p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        <span className={` rounded-lg text-lg ${theme === 'dark' ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'}`}>Download</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showDownloadDropdown && (
  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
    <div className="py-1">
      <button
        onClick={exportToCSV}
        className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        CSV (Excel)
      </button>
      <button
        onClick={exportToJSON}
        className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        JSON
      </button>
    </div>
  </div>
)}
                    </div>
                  </form>

                  <select
                    value={selectedRole}
                    onChange={handleRoleFilterChange}
                    className={`border p-2 rounded-lg text-lg shadow-sm ${theme === 'dark' ? 'bg-gray-600 text-white border-gray-500' : 'bg-white border-gray-300'}`}
                  >
                    <option value="all">All Roles</option>
                    {roleList.map((role) => (
                      <option key={role.mysqlId || role.id} value={role.mysqlId || role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>

                  <Link
                to="/dashboard/createuser"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition"
              >
                Add New User
              </Link>
                </div>
              </div>

              <div className="">
                <table className={`w-full border-collapse shadow-md rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`} style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr className={`uppercase text-lg leading-normal ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                      <th className="py-4 px-6 text-left" style={{ width: '100px' }}>Name</th>
                      <th className="py-4 px-6 text-left" style={{ width: '100px' }}>Lastname</th>
                      <th className="py-4 px-6 text-left" style={{ width: '100px' }}>Number</th>
                      <th className="py-4 px-6 text-left" style={{ width: '150px' }}>Email</th>
                      <th className="py-4 px-6 text-left" style={{ width: '100px' }}>Username</th>
                      <th className="py-4 px-6 text-left" style={{ width: '120px' }}>Birthdate</th>
                      <th className="py-4 px-6 text-left" style={{ width: '100px' }}>Gender</th>
                      {/* <th className="py-4 px-6 text-left" style={{ width: '100px' }}>Country</th> */}
                      {/* <th className="py-4 px-6 text-left" style={{ width: '100px' }}>City</th> */}
                      <th className="py-4 px-6 text-left" style={{ width: '150px' }}>Role</th>
                      <th className="py-4 px-6 text-center" style={{ width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((item) => (
                        <tr 
                          key={item.mysqlId || item.id} 
                          className={`border-b ${theme === 'dark' ? 'border-gray-500 hover:bg-gray-500' : 'border-gray-200 hover:bg-gray-100'}`}
                        >
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.name
                            )}
                          </td>
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="text"
                                name="lastName"
                                value={editFormData.lastName}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.lastName
                            )}
                          </td>
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="text"
                                name="number"
                                value={editFormData.number}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.number
                            )}
                          </td>
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.email
                            )}
                          </td>
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="text"
                                name="username"
                                value={editFormData.username}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.username
                            )}
                          </td>
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="date"
                                name="birthday"
                                value={editFormData.birthday}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.birthday ? item.birthday.split("T")[0] : ""
                            )}
                          </td>
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="text"
                                name="gender"
                                value={editFormData.gender}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.gender
                            )}
                          </td>
                          {/* <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="text"
                                name="country"
                                value={editFormData.country}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.country
                            )}
                          </td>
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <input
                                type="text"
                                name="city"
                                value={editFormData.city}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              />
                            ) : (
                              item.city
                            )}
                          </td> */}
                          <td className="py-4 px-6 truncated">
                            {editingId === (item.mysqlId || item.id) ? (
                              <select
                                name="roleId"
                                value={editFormData.roleId}
                                onChange={handleEditFormChange}
                                className={`border p-2 rounded w-full ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-white'}`}
                              >
                                {roleList.map((role) => (
                                  <option key={role.mysqlId} value={role.mysqlId}>
                                    {role.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              item.roleId?.name || ""
                            )}
                          </td>
                          <td className="py-4 px-6 flex justify-center space-x-3">
                            {editingId === (item.mysqlId || item.id) ? (
                              <>
                                <button
                                  onClick={() => handleSaveClick(item.mysqlId || item.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-lg"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelClick}
                                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-lg"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                 

                 <button
                        onClick={() => {
                          const userId = item.mysqlId || item.id;
                          navigate(`/dashboard/edituser/${userId}`);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg text-lg"
                      >
                        Edit
                      </button>

                                <button
                                  onClick={() => handleDeleteClick(item.mysqlId || item.id, item.name)}
                                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-lg"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className={`text-center py-6 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 
                      ? theme === 'dark' ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.ceil(userList.length / usersPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 rounded-lg ${currentPage === index + 1 
                          ? 'bg-blue-600 text-white' 
                          : theme === 'dark' ? 'bg-gray-500 hover:bg-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === Math.ceil(userList.length / usersPerPage)}
                    className={`px-4 py-2 rounded-lg ${currentPage === Math.ceil(userList.length / usersPerPage) 
                      ? theme === 'dark' ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmation
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={itemNameToDelete}
      />
    </div>
  );
};

export default User;