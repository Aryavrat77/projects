import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FormData } from "@/components/applicationInfo";

const UserProfile = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const storedId = localStorage.getItem('employeeId');
    const employeeId = id || storedId;
    if (employeeId) {
      axios.get(`http://localhost:8080/api/employees/${employeeId}`, { //54.213.40.3
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
    }
  }, [id]);

  if(!formData) return;

  return (
    <div className="flex items-center p-4">
      {/* <img
        src="" 
        alt="User Avatar"
        className="w-10 h-10 rounded-full"
      /> */}
      <div className="ml-4">
        <p className="text-sm font-semibold text-gray-700">{`${formData.first_name} ${formData.last_name}`}</p>
        <p className="text-sm text-gray-500">{`${formData.email}`}</p>
        {formData.role === "EMPLOYEE" && (
          <p className="text-sm text-gray-500">{"EMPLOYEE"}</p>
        )}
        {formData.role === "HR" && (
          <p className="text-sm text-gray-500">{"HR"}</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
  