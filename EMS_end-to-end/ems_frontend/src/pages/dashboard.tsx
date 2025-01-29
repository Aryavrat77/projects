import React, { useEffect, useState } from 'react';
import Sidebar from "@/components/sidebar";
import axios from 'axios';
import { FormData } from "@/components/applicationInfo";
import Image from 'next/image';
import logo from '@/public/logo.jpeg';
import dashboard from '@/public/dashboard.jpg';
import { useRouter } from 'next/router';
import Confirmation from '@/components/confirmation';
import { Education } from "@/components/educationInfo";
import { Company } from "@/components/companyInfo";
import AdminDashboard from './admin-dashboard';

const Dashboard = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [tempFormData, setTempFormData] = useState<FormData | null>(null);
  const router = useRouter();
  const { id, submitted } = router.query;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [edit, setEdit] = useState(0);
  const [editIndex, setEditIndex] = useState(0);
  const [education, setEducation] = useState<Education[]>([]);
  const [tempEducation, setTempEducation] = useState<Education[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tempCompanies, setTempCompanies] = useState<Company[]>([]);

  useEffect(() => {
    // const storedId = localStorage.getItem('employeeId');
    const employeeId = id;
    if (employeeId) {
      axios.get(`http://localhost:8080/api/employees/${employeeId}`, { //54.213.40.3
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then((response) => {
        setFormData(response.data);
        setTempFormData(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the employee data!', error);
      });

      axios.get(`http://localhost:8080/api/employees/${employeeId}/education`, { //54.213.40.3
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then((response) => {
        setEducation(response.data);
        setTempEducation(response.data);
        console.log("Education data: ", response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the education data!', error);
      });

      axios.get(`http://localhost:8080/api/employees/${employeeId}/workhistory`, { //54.213.40.3
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then((response) => {
        setCompanies(response.data);
        setTempCompanies(response.data);
        console.log("Work History data: ", response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the work history data!', error);
      });
    }
  }, [id]);

  useEffect(() => {
    if (submitted === 'true') {
      setShowConfirmation(true);
    }
  }, [submitted]);

  const navigateToForm = () => {
    router.push('/application-form')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(tempFormData);
    console.log(formData);

    try {
      console.log(localStorage.getItem('jwtToken'))
      const employeeResponse = await axios.put(`http://localhost:8080/api/employees/${id}`, tempFormData, { //54.213.40.3
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      console.log('Employee Updated Response:', employeeResponse.data);
      alert('Form edited successfully');
    } catch (error) {
      console.error('There was an error editing the employee form!', error);
      console.error('Employee Payload', tempFormData)
      alert('There was an error editing the employee form. Please try again.');
    }
  };

  const handleEducationSave = async (e: React.FormEvent, index: number) => {
    e.preventDefault();
    console.log(tempEducation);
    console.log(index);

    if(!isAllFieldsFilled()) {
      alert("Please fill out all necessary fields!")
      return
    }

    setEducation(tempEducation);
    setEdit(0);
    setEditIndex(0);

    try {
      console.log(localStorage.getItem('jwtToken'))
      if (tempEducation[index].education_id != '') {
          console.log("Education index: ", education[index].education_id);
          const educationResponse = await axios.put(`http://localhost:8080/api/employees/${education[index].education_id}/education`, tempEducation[index], {
              // 54.213.40.3
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
              }
          });
          console.log('Education Updated Response:', educationResponse.data);
          alert('Education form edited successfully');
      } else {
          const educationResponse = await axios.post(`http://localhost:8080/api/employees/${id}/education`, tempEducation[index], {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
              }
          });
          console.log('New Education Added Response:', educationResponse.data);
          {showConfirmation && <Confirmation message="Education added successfully!" />}
          // alert('Education added successfully');
          window.location.reload();
      }
    } catch (error) {
      console.error('There was an error saving the education form!', error);
      console.error('Education Payload', tempEducation[index])
      alert('There was an error saving the education form. Please try again.');
    }
  };

  const handleCompanySave = async (e: React.FormEvent, index: number) => {
    e.preventDefault();
    console.log(tempCompanies);
    console.log(index);

    if(!isAllFieldsFilled()) {
      alert("Please fill out all necessary fields!")
      return
    }

    setCompanies(tempCompanies);
    setEdit(0);
    setEditIndex(0);

    try {
      console.log(localStorage.getItem('jwtToken'))
      if (tempCompanies[index].work_history_id != '') {
        console.log("Work history index: ", companies[index].work_history_id);
        const workHistoryResponse = await axios.put(`http://localhost:8080/api/employees/${companies[index].work_history_id}/workhistory`, tempCompanies[index], {
          // 54.213.40.3
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        console.log('Work History Updated Response:', workHistoryResponse.data);
        alert('Work history form edited successfully');
      } else {
          const workHistoryResponse = await axios.post(`http://localhost:8080/api/employees/${id}/workhistory`, tempCompanies[index], {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
              }
          });
          console.log('New Work History Added Response:', workHistoryResponse.data);
          {showConfirmation && <Confirmation message="Work history added successfully!" />}
          // alert('Work history added successfully');
          window.location.reload();
      }
    } catch (error) {
      console.error('There was an error saving the work history form!', error);
      console.error('Work History Payload', tempCompanies[index])
      alert('There was an error saving the work history form. Please try again.');
    }
  };

  const handleEducationDelete = async (index: number) => {
    console.log(education[index]);
    try {
      console.log(localStorage.getItem('jwtToken'))
      console.log("Education index: ", education[index].education_id);
      const educationDelResponse = await axios.delete(`http://localhost:8080/api/employees/${education[index].education_id}/education`, {
        // 54.213.40.3
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      console.log('Education Deleted Response:', educationDelResponse.data);
      const updatedTempEducation = [...tempEducation];
      updatedTempEducation.splice(index, 1);
      setTempEducation(updatedTempEducation);
      const updatedEducation = [...education];
      updatedEducation.splice(index, 1);
      setEducation(updatedEducation);
      alert('Education deleted successfully');
    } catch (error) {
      console.error('There was an error deleting the education form!', error);
      console.error('Education Deletion Payload', education[index])
      alert('There was an error deleting the education form. Please try again.');
    }
  };

  const handleCompanyDelete = async (index: number) => {
    console.log(companies[index]);
    try {
      console.log(localStorage.getItem('jwtToken'))
      console.log("Work history index: ", companies[index].work_history_id);
      const companyDelResponse = await axios.delete(`http://localhost:8080/api/employees/${companies[index].work_history_id}/workhistory`, {
        // 54.213.40.3
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      console.log('Work History Deleted Response:', companyDelResponse.data);
      const updatedTempCompanies = [...tempCompanies];
      updatedTempCompanies.splice(index, 1);
      setCompanies(updatedTempCompanies);
      const updatedCompanies = [...companies];
      updatedCompanies.splice(index, 1);
      setCompanies(updatedCompanies);
      alert('Work history deleted successfully');
    } catch (error) {
      console.error('There was an error deleting the work history form!', error);
      console.error('Work History Deletion Payload', companies[index])
      alert('There was an error deleting the work history form. Please try again.');
    }
  };

  const handleAddEducation = () => {
    const newEducation: Education = {
      education_id: '',
      university_name: '',
      college_name: '',
      degree_type: '',
      advanced_degree_type: '',
      major: '',
      start_date: [0, 0, 0],
      end_date: [0, 0, 0],
      city: '',
      state: '',
      country: ''
    };
    const newTempEducation = [...tempEducation, newEducation];
    setTempEducation(newTempEducation);
    setEdit(2);
    setEditIndex(newTempEducation.length);
  };

  const handleAddCompany = () => {
    const newCompany: Company = {
      work_history_id: '',
      company_name: '',
      industry: '',
      employer_name: '',
      manager_name: '',
      position: '',
      duties: '',
      start_date: [0, 0, 0],
      end_date: [0, 0, 0],
      phone: '',
      reason_for_leaving: ''
    };
    const newTempCompanies = [...tempCompanies, newCompany];
    setTempCompanies(newTempCompanies);
    setEdit(3);
    setEditIndex(newTempCompanies.length);
  };

  const isAllFieldsFilled = () => {
    let data: Company | Education;
  
    if (edit === 3) {
      data = tempCompanies[editIndex - 1];
    } else if (edit === 2) {
      data = tempEducation[editIndex - 1];
    } else {
      return false;
    }
  
    if (!data) {
      return false;
    }
  
    const isDateFilled = (dateArray: number[] | undefined) => 
      dateArray !== undefined && dateArray.length === 3 && dateArray.every(datePart => datePart > 0);

  if ('company_name' in data) {
    const company = data as Company;
    return (
      company.company_name !== '' &&
      company.industry !== '' &&
      company.employer_name !== '' &&
      company.manager_name !== '' &&
      company.position !== '' &&
      company.duties !== '' &&
      isDateFilled(company.start_date) &&
      isDateFilled(company.end_date) &&
      company.phone !== '' &&
      company.reason_for_leaving !== ''
    );
  }

  if ('university_name' in data) {
    const education = data as Education;
    return (
      education.university_name !== '' &&
      education.college_name !== '' &&
      education.degree_type !== '' &&
      education.major !== '' &&
      isDateFilled(education.start_date) &&
      isDateFilled(education.end_date) &&
      education.city !== '' &&
      education.state !== '' &&
      education.country !== ''
    );
  }
  
    return false;
  };

  if (!formData || !tempFormData || !formData.cell_phone && formData.role === 'EMPLOYEE') {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl font-bold ml-6 mt-6">Dashboard</h1>
          <div className="bg-white rounded-lg p-6 m-6 shadow max-w-xxl mx-auto">
            <main className="flex flex-1 flex-col justify-center items-center">
              <div className="flex justify-center items-center h-full relative">
                <p className="text-lg text-blue-900 font-semibold text-center">
                  Please fill out the application form to create your dashboard profile!
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={navigateToForm}
                  className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800"
                >
                  Application Form
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (formData.role === 'HR') {
    return (
      <AdminDashboard />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 relative">
        {showConfirmation && <Confirmation message="The application form was submitted successfully!" />}
        <div className="bg-white bg-opacity-90 p-8 rounded shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Profile</h1>
              <p className="text-gray-700 text-xl">Welcome back, {formData.first_name}!</p>
            </div>
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Profile"
                className="rounded-full h-14 w-14"
              />
              <div className="ml-4">
                <p className="text-gray-800 text-xl font-semibold">{formData.first_name} {formData.last_name}</p>
                <p className="text-gray-600 text-sm">{formData.job_title}</p>
                <p className="text-gray-600 text-sm">{formData.job_type}</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-lg shadow-md" style={{ height: '170px', width: '100%' }}>
            <Image 
              src={dashboard} 
              alt="Dashboard" 
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="bg-white bg-opacity-90 rounded shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            {edit === 1 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.first_name}
                    onChange={(e) => setTempFormData({ ...tempFormData, first_name: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.last_name}
                    onChange={(e) => setTempFormData({ ...tempFormData, last_name: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Middle Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.middle_name}
                    onChange={(e) => setTempFormData({ ...tempFormData, middle_name: e.target.value })}
                  />
                </div>
                {tempFormData.preferred_name && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Preferred Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={tempFormData.preferred_name}
                      onChange={(e) => setTempFormData({ ...tempFormData, preferred_name: e.target.value })}
                    />
                  </div>
                )}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Cell Phone</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.cell_phone}
                    onChange={(e) => setTempFormData({ ...tempFormData, cell_phone: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Email</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.email}
                    onChange={(e) => setTempFormData({ ...tempFormData, email: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Home Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.home_address}
                    onChange={(e) => setTempFormData({ ...tempFormData, home_address: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.city}
                    onChange={(e) => setTempFormData({ ...tempFormData, city: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">State</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.state}
                    onChange={(e) => setTempFormData({ ...tempFormData, state: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Zip Code</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.zip_code}
                    onChange={(e) => setTempFormData({ ...tempFormData, zip_code: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">First Name</label>
                  <p>{formData.first_name}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Last Name</label>
                  <p>{formData.last_name}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Middle Name</label>
                  <p>{formData.middle_name}</p>
                </div>
                {formData.preferred_name && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Preferred Name</label>
                    <p>{formData.preferred_name}</p>
                  </div>
                )}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Cell Phone</label>
                  <p>{formData.cell_phone}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Email</label>
                  <p>{formData.email}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Home Address</label>
                  <p>{formData.home_address}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">City</label>
                  <p>{formData.city}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">State</label>
                  <p>{formData.state}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Zip Code</label>
                  <p>{formData.zip_code}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              {edit === 1 ? (
                <>
                  <button 
                    onClick={(e) => {
                      setFormData(tempFormData);
                      setEdit(0);
                      handleSave(e);
                    }} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mr-2 mt-2"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setEdit(0)
                      setTempFormData(formData)
                    }} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                edit === 0 && (
                  <button 
                    onClick={() => setEdit(1)} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800"
                  >
                    Edit
                  </button>
                )
              )}
            </div>
          </div>
          <div className="bg-white bg-opacity-90 rounded shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Education Background</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block font-semibold">High School Diploma/GED</label>
          {edit === 2 && editIndex === 0 ? (
            <input
              type="checkbox"
              checked={tempFormData.high_school_diploma}
              onChange={(e) => setTempFormData({ ...tempFormData, high_school_diploma: e.target.checked })}
            />
          ) : (
            <p>{formData.high_school_diploma ? 'Yes' : 'No'}</p>
          )}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block font-semibold">College Degree</label>
          {edit === 2 && editIndex === 0 ? (
            <input
              type="checkbox"
              checked={tempFormData.college_degree}
              onChange={(e) => setTempFormData({ ...tempFormData, college_degree: e.target.checked })}
            />
          ) : (
            <p>{formData.college_degree ? 'Yes' : 'No'}</p>
          )}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block font-semibold">Highest Education Level</label>
          {edit === 2 && editIndex === 0 ? (
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={tempFormData.highest_education_level}
              onChange={(e) => setTempFormData({ ...tempFormData, highest_education_level: e.target.value })}
            />
          ) : (
            <p>{formData.highest_education_level}</p>
          )}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block font-semibold">Certifications</label>
          {edit === 2 && editIndex === 0 ? (
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={tempFormData.certifications}
              onChange={(e) => setTempFormData({ ...tempFormData, certifications: e.target.value })}
            />
          ) : (
            <p>{formData.certifications}</p>
          )}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block font-semibold">Skills</label>
          {edit === 2 && editIndex === 0 ? (
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={tempFormData.skills}
              onChange={(e) => setTempFormData({ ...tempFormData, skills: e.target.value })}
            />
          ) : (
            <p>{formData.skills}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end mb-4">
        {edit === 2 && editIndex === 0 ? (
          <>
            <button 
              onClick={(e) => {
                setFormData(tempFormData);
                setEdit(0);
                handleSave(e);
              }} 
              className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mr-2 mt-2"
            >
              Save
            </button>
            <button 
              onClick={() => {
                setEdit(0)
                setTempFormData(formData)
              }} 
              className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
            >
              Cancel
            </button>
          </>
        ) : (
          edit === 0 && (
            <button 
              onClick={() => setEdit(2)} 
              className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800"
            >
              Edit
            </button>
          )
        )}
      </div>
      {education.length > 0 &&
        tempEducation.map((edu, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg w-full">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">University Name</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={edu.university_name}
                      onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        updatedTempEducation[index] = { ...edu, university_name: e.target.value };
                        setTempEducation(updatedTempEducation);
                      }}
                    />
                  ) : (
                    <p>{edu.university_name}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">College Name</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={edu.college_name}
                      onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        updatedTempEducation[index] = { ...edu, college_name: e.target.value };
                        setTempEducation(updatedTempEducation);
                      }}
                    />
                  ) : (
                    <p>{edu.college_name}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Degree Type</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={edu.degree_type}
                      onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        updatedTempEducation[index] = { ...edu, degree_type: e.target.value };
                        setTempEducation(updatedTempEducation);
                      }}
                    />
                  ) : (
                    <p>{edu.degree_type}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Advanced Degree Type</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={edu.advanced_degree_type}
                      onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        updatedTempEducation[index] = { ...edu, advanced_degree_type: e.target.value };
                        setTempEducation(updatedTempEducation);
                      }}
                    />
                  ) : (
                    <p>{edu.advanced_degree_type}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Major</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={edu.major}
                      onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        updatedTempEducation[index] = { ...edu, major: e.target.value };
                        setTempEducation(updatedTempEducation);
                      }}
                    />
                  ) : (
                    <p>{edu.major}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Start Date</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    value={edu.start_date ? `${edu.start_date[0]}-${String(edu.start_date[1]).padStart(2, '0')}-${String(edu.start_date[2]).padStart(2, '0')}` : ''}
                    onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        const dateParts = e.target.value.split('-');
                        updatedTempEducation[index] = { ...edu, start_date: [parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2])] };
                        setTempEducation(updatedTempEducation);
                    }}
                />
                    // <input
                    //   type="text"
                    //   className="w-full px-3 py-2 border rounded"
                    //   value={edu.start_date}
                    //   onChange={(e) => {
                    //     const updatedTempEducation = [...tempEducation];
                    //     updatedTempEducation[index] = { ...edu, start_date: e.target.value };
                    //     setTempEducation(updatedTempEducation);
                    //   }}
                    // />
                  ) : (
                    <p>{edu.start_date && `${edu.start_date[1]}/${edu.start_date[2]}/${edu.start_date[0]}`}</p>
                  )}
                  
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">End Date</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    value={edu.end_date ? `${edu.end_date[0]}-${String(edu.end_date[1]).padStart(2, '0')}-${String(edu.end_date[2]).padStart(2, '0')}` : ''}
                    onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        const dateParts = e.target.value.split('-');
                        updatedTempEducation[index] = { ...edu, end_date: [parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2])] };
                        setTempEducation(updatedTempEducation);
                    }}
                />
                    // <input
                    //   type="text"
                    //   className="w-full px-3 py-2 border rounded"
                    //   value={edu.end_date}
                    //   onChange={(e) => {
                    //     const updatedTempEducation = [...tempEducation];
                    //     updatedTempEducation[index] = { ...edu, end_date: e.target.value };
                    //     setTempEducation(updatedTempEducation);
                    //   }}
                    // />
                  ) : (
                    <p>{edu.end_date && `${edu.end_date[1]}/${edu.end_date[2]}/${edu.end_date[0]}`}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">City</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={edu.city}
                      onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        updatedTempEducation[index] = { ...edu, city: e.target.value };
                        setTempEducation(updatedTempEducation);
                      }}
                    />
                  ) : (
                    <p>{edu.city}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">State</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={edu.state}
                      onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        updatedTempEducation[index] = { ...edu, state: e.target.value };
                        setTempEducation(updatedTempEducation);
                      }}
                    />
                  ) : (
                    <p>{edu.state}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Country</label>
                  {edit === 2 && editIndex === index+1 ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={edu.country}
                      onChange={(e) => {
                        const updatedTempEducation = [...tempEducation];
                        updatedTempEducation[index] = { ...edu, country: e.target.value };
                        setTempEducation(updatedTempEducation);
                      }}
                    />
                  ) : (
                    <p>{edu.country}</p>
                  )}
                </div>
            </div>
            <div className="flex justify-end mb-4">
              {edit === 2 && editIndex === index+1 ? (
                <>
                  <button 
                    onClick={(e) => {
                      handleEducationSave(e, index);
                    }} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mr-2 mt-2"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setEdit(0)
                      setEditIndex(0)
                      setTempEducation(education)
                    }} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                edit === 0 && (
                  <div>
                    <button 
                      onClick={() => {
                        setEdit(2)
                        setEditIndex(index+1)
                      }} 
                      className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleEducationDelete(index)} 
                      className="inline-block px-3 py-2 text-white bg-red-600 rounded hover:bg-red-700 ml-2 mt-2">
                        Delete
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
        {edit === 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddEducation}
              className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800"
            >
              Add Education
            </button>
          </div>
        )}
        

        </div>
        <div className="bg-white bg-opacity-90 rounded shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Work History</h2><br></br>
          {companies.length > 0 && tempCompanies.map((work, index: number) => (
                <div key={index} className="mb-4 p-4 border rounded-lg w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-semibold">Company Name</label>
                      {edit === 3 && editIndex === index+1 ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded"
                          value={work.company_name}
                          onChange={(e) => {
                            const updatedTempCompanies = [...tempCompanies];
                            updatedTempCompanies[index] = { ...work, company_name: e.target.value };
                            setTempCompanies(updatedTempCompanies);
                          }}
                        />
                      ) : (
                        <p>{work.company_name}</p>
                      )}
                    </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">Industry</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={work.industry}
                            onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              updatedTempCompanies[index] = { ...work, industry: e.target.value };
                              setTempCompanies(updatedTempCompanies);
                            }}
                          />
                        ) : (
                          <p>{work.industry}</p>
                        )}
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">Employer Name</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={work.employer_name}
                            onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              updatedTempCompanies[index] = { ...work, employer_name: e.target.value };
                              setTempCompanies(updatedTempCompanies);
                            }}
                          />
                        ) : (
                          <p>{work.employer_name}</p>
                        )}
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">Manager Name</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={work.manager_name}
                            onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              updatedTempCompanies[index] = { ...work, manager_name: e.target.value };
                              setTempCompanies(updatedTempCompanies);
                            }}
                          />
                        ) : (
                          <p>{work.manager_name}</p>
                        )}
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">Position</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={work.position}
                            onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              updatedTempCompanies[index] = { ...work, position: e.target.value };
                              setTempCompanies(updatedTempCompanies);
                            }}
                          />
                        ) : (
                          <p>{work.position}</p>
                        )}
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">Work Duties</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={work.duties}
                            onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              updatedTempCompanies[index] = { ...work, duties: e.target.value };
                              setTempCompanies(updatedTempCompanies);
                            }}
                          />
                        ) : (
                          <p>{work.duties}</p>
                        )}
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">Start Date</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                          type="date"
                          className="w-full px-3 py-2 border rounded"
                          value={work.start_date ? `${work.start_date[0]}-${String(work.start_date[1]).padStart(2, '0')}-${String(work.start_date[2]).padStart(2, '0')}` : ''}
                          onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              const dateParts = e.target.value.split('-');
                              updatedTempCompanies[index] = { ...work, start_date: [parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2])] };
                              setTempCompanies(updatedTempCompanies);
                          }}
                      />
                          // <input
                          //   type="text"
                          //   className="w-full px-3 py-2 border rounded"
                          //   value={work.start_date}
                          //   onChange={(e) => {
                          //     const updatedTempCompanies = [...tempCompanies];
                          //     updatedTempCompanies[index] = { ...work, start_date: e.target.value };
                          //     setTempCompanies(updatedTempCompanies);
                          //   }}
                          // />
                        ) : (
                          <p>{work.start_date && `${work.start_date[1]}/${work.start_date[2]}/${work.start_date[0]}`}</p>
                        )}
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">End Date</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                          type="date"
                          className="w-full px-3 py-2 border rounded"
                          value={work.end_date ? `${work.end_date[0]}-${String(work.end_date[1]).padStart(2, '0')}-${String(work.end_date[2]).padStart(2, '0')}` : ''}
                          onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              const dateParts = e.target.value.split('-');
                              updatedTempCompanies[index] = { ...work, end_date: [parseInt(dateParts[0]), parseInt(dateParts[1]), parseInt(dateParts[2])] };
                              setTempCompanies(updatedTempCompanies);
                          }}
                      />
                          // <input
                          //   type="text"
                          //   className="w-full px-3 py-2 border rounded"
                          //   value={work.end_date}
                          //   onChange={(e) => {
                          //     const updatedTempCompanies = [...tempCompanies];
                          //     updatedTempCompanies[index] = { ...work, end_date: e.target.value };
                          //     setTempCompanies(updatedTempCompanies);
                          //   }}
                          // />
                        ) : (
                          <p>{work.end_date && `${work.end_date[1]}/${work.end_date[2]}/${work.end_date[0]}`}</p>
                        )}
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">Phone</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={work.phone}
                            onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              updatedTempCompanies[index] = { ...work, phone: e.target.value };
                              setTempCompanies(updatedTempCompanies);
                            }}
                          />
                        ) : (
                          <p>{work.phone}</p>
                        )}
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-semibold">Reason for Leaving</label>
                        {edit === 3 && editIndex === index+1 ? (
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={work.reason_for_leaving}
                            onChange={(e) => {
                              const updatedTempCompanies = [...tempCompanies];
                              updatedTempCompanies[index] = { ...work, reason_for_leaving: e.target.value };
                              setTempCompanies(updatedTempCompanies);
                            }}
                          />
                        ) : (
                          <p>{work.reason_for_leaving}</p>
                        )}
                      </div>
                  </div>
                  <div className="flex justify-end mb-4">
                    {edit === 3 && editIndex === index+1 ? (
                      <>
                        <button 
                          onClick={(e) => {
                            handleCompanySave(e, index);
                          }} 
                          className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mr-2 mt-2"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => {
                            setEdit(0)
                            setEditIndex(0)
                            setTempCompanies(companies)
                          }} 
                          className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      edit === 0 && (
                        <div>
                          <button 
                            onClick={() => {
                              setEdit(3)
                              setEditIndex(index+1)
                            }} 
                            className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleCompanyDelete(index)} 
                            className="inline-block px-3 py-2 text-white bg-red-600 rounded hover:bg-red-700 ml-2 mt-2">
                              Delete
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
              {edit === 0 && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAddCompany}
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800"
                  >
                    Add Work History
                  </button>
                </div>
              )}
          </div>
          <div className="bg-white bg-opacity-90 rounded shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Job Details</h2>
            {edit === 4 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Job Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.job_title}
                    onChange={(e) => setTempFormData({ ...tempFormData, job_title: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Job Type</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.job_type}
                    onChange={(e) => setTempFormData({ ...tempFormData, job_type: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Employment Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded"
                    value={tempFormData.employment_type}
                    onChange={(e) => setTempFormData({ ...tempFormData, employment_type: e.target.value })}
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Available Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    value={`${tempFormData.available_start_date[0]}-${String(tempFormData.available_start_date[1]).padStart(2, '0')}-${String(tempFormData.available_start_date[2]).padStart(2, '0')}`}
                    onChange={(e) => {
                        const dateParts = e.target.value.split('-');
                        setTempFormData({
                            ...tempFormData,
                            available_start_date: [
                                parseInt(dateParts[0]),
                                parseInt(dateParts[1]),
                                parseInt(dateParts[2])
                            ]
                        });
                    }}
                />
                  {/* <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={`${tempFormData.available_start_date[1]}/${tempFormData.available_start_date[2]}/${tempFormData.available_start_date[0]}`}
                    onChange={(e) => setTempFormData({ ...tempFormData, available_start_date: e.target.value })}
                  /> */}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Previous Client Employment</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.client_employment}
                    onChange={(e) => setTempFormData({ ...tempFormData, client_employment: e.target.checked })}
                  />
                </div>
                {tempFormData.client_employment && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Client Names</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={tempFormData.client_names}
                      onChange={(e) => setTempFormData({ ...tempFormData, client_names: e.target.value })}
                    />
                  </div>
                )}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Signed Non Compete</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.non_compete}
                    onChange={(e) => setTempFormData({ ...tempFormData, non_compete: e.target.checked })}
                  />
                </div>
                {tempFormData.non_compete && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Non Compete Prevent Servicing Clients</label>
                    <input
                      type="checkbox"
                      checked={tempFormData.prevent_servicing_clients}
                      onChange={(e) => setTempFormData({ ...tempFormData, prevent_servicing_clients: e.target.checked })}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Job Title</label>
                  <p>{formData.job_title}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Job Type</label>
                  <p>{formData.job_type}</p>
                </div>
                {formData.employment_type === "full_time" && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Employment Type</label>
                    <p>Full Time</p>
                  </div>
                )}
                {formData.employment_type === "part_time" && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Employment Type</label>
                    <p>Part Time</p>
                  </div>
                )}
                {formData.employment_type === "contract" && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Employment Type</label>
                    <p>Contract</p>
                  </div>
                )}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Available Start Date</label>
                  <p>{`${formData.available_start_date[1]}/${formData.available_start_date[2]}/${formData.available_start_date[0]}`}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Previous Client Employment</label>
                  <p>{formData.client_employment ? 'Yes' : 'No'}</p>
                </div>
                {formData.client_employment && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Client Names</label>
                    <p>{formData.client_names}</p>
                  </div>
                )}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Signed Non Compete</label>
                  <p>{formData.non_compete ? 'Yes' : 'No'}</p>
                </div>
                {formData.non_compete && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold">Non Compete Prevent Servicing Clients</label>
                    <p>{formData.prevent_servicing_clients ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end mt-4">
              {edit === 4 ? (
                <>
                  <button 
                    onClick={(e) => {
                      setFormData(tempFormData);
                      setEdit(0);
                      handleSave(e);
                    }} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mr-2 mt-2"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setEdit(0)
                      setTempFormData(formData)
                    }} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                edit === 0 && (
                  <button 
                    onClick={() => setEdit(4)} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800"
                  >
                    Edit
                  </button>
                )
              )}
            </div>
          </div>
          <div className="bg-white bg-opacity-90 rounded shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Other Info</h2><br></br>
            {edit === 5 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Valid Drivers License</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.drivers_license}
                    onChange={(e) => setTempFormData({ ...tempFormData, drivers_license: e.target.checked })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">License ever Revoked/Suspended</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.license_suspended}
                    onChange={(e) => setTempFormData({ ...tempFormData, license_suspended: e.target.checked })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Reliable Transportation</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.has_transportation}
                    onChange={(e) => setTempFormData({ ...tempFormData, has_transportation: e.target.checked })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Can Drive/Service Clients if needed</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.can_visit_clients}
                    onChange={(e) => setTempFormData({ ...tempFormData, can_visit_clients: e.target.checked })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Right to Work in the U.S.</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.right_to_work}
                    onChange={(e) => setTempFormData({ ...tempFormData, right_to_work: e.target.checked })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Require Sponsorship from R4</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.need_sponsorship}
                    onChange={(e) => setTempFormData({ ...tempFormData, need_sponsorship: e.target.checked })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">COVID Vaccinated</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.covid_vaccinated}
                    onChange={(e) => setTempFormData({ ...tempFormData, covid_vaccinated: e.target.checked })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Will Obtain COVID Vaccination for Client</label>
                  <input
                    type="checkbox"
                    checked={tempFormData.will_get_vaccinated}
                    onChange={(e) => setTempFormData({ ...tempFormData, will_get_vaccinated: e.target.checked })}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Valid Drivers License</label>
                  <p>{formData.drivers_license ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">License ever Revoked/Suspended</label>
                  <p>{formData.license_suspended ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Reliable Transportation</label>
                  <p>{formData.has_transportation ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Can Drive/Service Clients if needed</label>
                  <p>{formData.can_visit_clients ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Right to Work in the U.S.</label>
                  <p>{formData.right_to_work ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Require Sponsorship from R4</label>
                  <p>{formData.need_sponsorship ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">COVID Vaccinated</label>
                  <p>{formData.covid_vaccinated ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold">Will Obtain COVID Vaccination for Client</label>
                  <p>{formData.will_get_vaccinated ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              {edit === 5 ? (
                <>
                  <button 
                    onClick={(e) => {
                      setFormData(tempFormData);
                      setEdit(0);
                      handleSave(e);
                    }} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mr-2 mt-2"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setEdit(0)
                      setTempFormData(formData)
                    }} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                edit === 0 && (
                  <button 
                    onClick={() => setEdit(5)} 
                    className="inline-block px-3 py-2 text-white bg-black rounded hover:bg-gray-800 mt-2"
                  >
                    Edit
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
