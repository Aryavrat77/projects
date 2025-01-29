import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { FormData } from '@/components/applicationInfo';

const AdminDashboard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('HR');
  const [employees, setEmployees] = useState<FormData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const employeesPerPage = 10;
  
  const roles = ['EMPLOYEE', 'HR'];

  useEffect(() => {
    axios.get(`http://localhost:8080/api/employees`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then((response) => {
        setEmployees(response.data);
        console.log("Employee Data:", response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the employee data!', error);
      });
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const filteredEmployees = employees.filter(emp => emp.role === selectedRole);
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Employee List</h1>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search"
            className="p-2 border border-gray-300 rounded"
          />
          <div className="flex items-center">
            <label className="font-semibold mr-2">Filter by Role:</label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="p-2 border border-gray-300 rounded"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">List by Role</h2>
          <h3 className="text-lg font-semibold mb-4">{selectedRole} Role</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Select</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Role</th>
                <th className="py-2 px-4 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="py-2 px-4 border-b text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="py-2 px-4 border-b">{emp.first_name} {emp.last_name}</td>
                  <td className="py-2 px-4 border-b">{emp.email}</td>
                  <td className="py-2 px-4 border-b">{emp.role}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button className="text-blue-500 mr-2">✎</button>
                    <button className="text-red-500">🗑️</button>
                  </td>
                </tr>
              ))}
              {currentEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">No employees found for the selected role.</td>
                </tr>
              )}
            </tbody>
          </table>
          {filteredEmployees.length > employeesPerPage && (
            <div className="flex justify-between items-center mt-4">
              <span>{`${currentPage} of ${totalPages}`}</span>
              <div>
                <button 
                  className="p-2 border border-gray-300 rounded mr-2" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ◀
                </button>
                <button 
                  className="p-2 border border-gray-300 rounded" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  ▶
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
