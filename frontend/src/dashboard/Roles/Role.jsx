import React, { useState, useEffect } from 'react';
import { useTheme } from "../../components/ThemeContext";
import axios from 'axios';

const Role = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({});
  const [roleList, setRoleList] = useState([]);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/role');
      setRoleList(response.data);
      setError('');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch roles';
      setError(message);
      setRoleList([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://localhost:5001/api/role/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/role', formData);
      }
      fetchRoles();
      setFormData({});
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (item) => {
    const editData = { ...item };
    if (item.mysqlId) {
      editData.id = item.mysqlId;
    }
    setFormData(editData);
  };

  const handleDeleteClick = (id, name) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemName: name
    });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/role/${deleteModal.itemId}`);
      fetchRoles();
      setDeleteModal({ isOpen: false, itemId: null, itemName: '' });
    } catch (err) {
      setError('Failed to delete role');
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`shadow-lg rounded-lg p-6 w-full max-w-7xl ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Role Management</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input 
            type="text"
            placeholder="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`border p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
          />
          
          <button 
            type="submit" 
            className={`w-full ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 rounded-md font-semibold text-lg`}
          >
            {formData.id ? 'Përditëso' : 'Shto'}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className={`w-full border-collapse shadow-md rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
            <thead>
              <tr className={`${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'} uppercase text-sm leading-normal`}>
                <th className="py-3 px-6 text-left">name</th>
                <th className="py-3 px-6 text-center">Veprime</th>
              </tr>
            </thead>
            <tbody className={`text-sm font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {roleList.length > 0 ? (
                roleList.map((item) => (
                  <tr 
                    key={item.mysqlId || item.id} 
                    className={`border-b ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-100'}`}
                  >
                    <td className="py-3 px-6 text-left">{item.name}</td>
                    <td className="py-3 px-6 flex justify-center space-x-2">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item.mysqlId || item.id, item.name)} 
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      Nuk ka të dhëna
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Delete {deleteModal.itemName}?</h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, itemId: null, itemName: '' })}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                  data-testid="confirm-delete"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Role;