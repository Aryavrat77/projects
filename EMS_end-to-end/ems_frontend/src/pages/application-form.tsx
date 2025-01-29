import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import CompanyModal from '@/components/companyModal';
import axios from 'axios';
import { useRouter } from 'next/router';
import SignatureModal from '@/components/signatureModal';

type Education = {
  education_id: string;
  university_name: string;
  college_name: string;
  degree_type: string;
  advanced_degree_type: string;
  major: string;
  start_date: string;
  end_date: string;
  city: string;
  state: string;
  country: string;
};

const initialEducationState: Education = {
  education_id: '',
  university_name: '',
  college_name: '',
  degree_type: '',
  advanced_degree_type: '',
  major: '',
  start_date: '',
  end_date: '',
  city: '',
  state: '',
  country: '',
};

type Company = {
  work_history_id: string;
  company_name: string;
  employer_name: string;
  position: string;
  duties: string;
  manager_name: string;
  phone: string;
  industry: string;
  start_date: string;
  end_date: string;
  reason_for_leaving: string;
};

const initialWorkHistoryState: Company = {
  work_history_id: '',
  company_name: '',
  employer_name: '',
  position: '',
  duties: '',
  manager_name: '',
  phone: '',
  industry: '',
  start_date: '',
  end_date: '',
  reason_for_leaving: '',
};

const ApplicationForm = () => {
  const [step, setStep] = useState(1);
  
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const [educationCount, setEducationCount] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workHistory, setWorkHistory] = useState<Company>(initialWorkHistoryState);
  const [editCompanyData, setEditCompanyData] = useState<Company>(initialWorkHistoryState);
  const [companies, setCompanies] = useState<Company[]>([]);

  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    preferred_name: '',
    email: '',
    cell_phone: '',
    home_address: '',
    city: '',
    state: '',
    zip_code: '',
    previous_names: '',
    high_school_diploma: null,
    college_degree: null,
    highest_education_level: '',
    certifications: '',
    skills: '',
    availability: {
      overtime: null,
      weekends: null,
      holidays: null,
      second_shift: null,
      third_shift: null,
      flex_schedule: null,
      non_standard_schedule: null,
    },
    job_title: '',
    job_type: '',
    employment_type: '',
    available_start_date: '',
    reason_for_looking: '',
    heard_about_r4: [] as string[],
    r4_employee_referral: null,
    r4_employee_referral_name: '',
    current_employment: null,
    notice_period: '',
    may_contact_current_employer: null,
    reasons_no_contact: '',
    client_employment: null,
    client_names: '',
    non_compete: null,
    prevent_servicing_clients: null,
    drivers_license: null,
    license_suspended: null,
    has_transportation: null,
    can_visit_clients: null,
    right_to_work: null,
    need_sponsorship: null,
    covid_vaccinated: null,
    will_get_vaccinated: null,
    authorize_verification: null,
    id: localStorage.getItem('employeeId'),
    signature_date: '',
  });

  useEffect(() => {
    window.location.hash = `#${step}`;
  }, [step]);

  const employeeId = localStorage.getItem('employeeId');
  if (employeeId && !formData.first_name) {
    axios.get(`http://localhost:8080/api/employees/${employeeId}`, { //54.213.40.3
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
    .then((response) => {
      setFormData(prevFormData => ({
        ...prevFormData,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        role: response.data.role
      }));
    })
    .catch((error) => {
      console.error('There was an error fetching the employee data!', error);
    });
  }


  const [education, setEducation] = useState<Education[]>([initialEducationState]);

  const handleAddEducation = () => {
    setEducationCount(educationCount + 1);
    setEducation(prevEducation => [
      ...prevEducation,
      { ...initialEducationState }
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducationCount(educationCount - 1);
    setEducation(prevEducation => prevEducation.filter((_, i) => i !== index));
  };

  const checkEducationCount = () => {
    return educationCount > 1;
  };

  const handleRemoveWorkHistory = (index: number) => {
    setCompanies(prevCompanies => prevCompanies.filter((_, i) => i !== index));
  };
  

  const handleNext = () => {
    setStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleStepClick = (index: React.SetStateAction<number>) => {
    setStep(index);
    window.scrollTo(0, 0);
  };

  const handleOpenSignatureModal = () => setIsSignatureModalOpen(true);
  const handleCloseSignatureModal = () => setIsSignatureModalOpen(false);
  const handleSaveSignature = (sig: string) => {
    setSignature(sig);
    const today = new Date().toLocaleDateString('en-US');
    setFormData({
      ...formData,
      signature_date: today
    })
    handleCloseSignatureModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isAvailabilityField = name in formData.availability;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'heard_about_r4') {
        setFormData({
          ...formData,
          heard_about_r4: checked
            ? [...formData.heard_about_r4, value]
            : formData.heard_about_r4.filter(item => item !== value)
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else if (type === 'radio') {
      if (isAvailabilityField) {
        setFormData({
          ...formData,
          availability: {
            ...formData.availability,
            [name]: value === 'true' ? true : false
          }
        });
      } else {
        setFormData({
          ...formData,
          [name]: value === 'true' ? true : false
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Education,
    index: number
  ) => {
    const { value } = e.target;
    setEducation(prevEducation => {
      const newEducation = [...prevEducation];
      newEducation[index] = {
        ...newEducation[index],
        [field]: value,
      };
      return newEducation;
    });
  };

  
  const handleWorkHistoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof Company
  ) => {
    const { value } = e.target;
    setWorkHistory(prevWorkHistory => ({
      ...prevWorkHistory,
      [field]: value,
    }));
  };
  

  const handleAddSection = () => {
    setEditCompanyData(initialWorkHistoryState);
    setShowSuccessMessage(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditCompanyData(initialWorkHistoryState);
  };
  
  const handleEditSection = (index: number) => {
    const companyToEdit = companies[index];
    setShowSuccessMessage(false);
    if (companyToEdit) {
      setEditCompanyData(companyToEdit);
      setIsModalOpen(true);
    }
  };

  const handleRemoveSection = (index: number) => {
    setCompanies(prevCompanies => {
      const updatedCompanies = [...prevCompanies];
      updatedCompanies.splice(index, 0);
      return updatedCompanies;
    });
  };

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showSuccessPopup = (companyName: string) => {
    setSuccessMessage(`Successfully saved ${companyName}`);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleSaveModal = (companyData: Company) => {
    if (editCompanyData && companies.includes(editCompanyData)) {
      setCompanies(companies.map((company, index) =>
        index === companies.indexOf(editCompanyData) ? { ...companyData } : company
      ));
    } else {
      setCompanies([...companies, companyData]);
    }
    handleCloseModal();
    showSuccessPopup(companyData.company_name);
  };

  const [createdEmployeeId, setCreatedEmployeeId] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    
    const missingFields = checkMissingFields();

    if (missingFields.length > 0) {
        alert(`Please complete the following required fields:\n${missingFields.join('\n')}`);
        return;
    }

    try {
      console.log(localStorage.getItem('jwtToken'))
      const response = await axios.put(`http://localhost:8080/api/employees/${formData.id}`, formData, {
        // 54.213.40.3
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      console.log('Response:', response.data);
      // const createdEmployee = response.data;
      // console.log('Employee created with ID:', createdEmployee.id);
      // setCreatedEmployeeId(createdEmployee.id);
      // formData.id = createdEmployee.id;
      console.log(formData.id);
      // localStorage.setItem('createdEmployeeId', createdEmployee.id);

      if (formData.college_degree) {
        for (const edu of education) {
          try {
            const educationResponse = await axios.post(`http://localhost:8080/api/employees/${formData.id}/education`, edu, {
              // 54.213.40.3
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
              }
            });
            console.log('Education response:', educationResponse.data);
            edu.education_id = educationResponse.data.education_id;
          } catch (error) {
            console.error('There was an error posting your education form data. Please try again.', error);
            alert('There was an error posting your education form data. Please try again.');
            return;
          }
        }
      }

      for (const work of companies) {
        try {
          const workHistoryResponse = await axios.post(`http://localhost:8080/api/employees/${formData.id}/workhistory`, work, {
            // 54.213.40.3
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
          });
          console.log('Work History response:', workHistoryResponse.data);
          work.work_history_id = workHistoryResponse.data.work_history_id;
        } catch (error) {
          console.error('There was an error posting your work history form data. Please try again.', error);
          alert('There was an error posting your work history form data. Please try again.');
          return;
        }
      }

      alert('Form submitted successfully');

      try {
        const mailData = new FormData();
        mailData.append('to', formData.email);
        mailData.append('subject', 'R4 Application Form Submission Successful!');
        mailData.append('body', `Hi ${formData.first_name},\n\tWe received your R4 application form information and submission! A file is attached to this email with your form submission details. Thank you and we will get back to you soon.\n\nRegards,\nR4 Team`);
        // Prepare the file with response data
        const fileContent = {
          employeeData: response.data,
          educationData: education,
          workHistoryData: companies,
        };
        const responseFile = new Blob([JSON.stringify(fileContent, null, 2)], { type: 'application/json' });
        mailData.append('file', responseFile, 'R4_submission.json');
        await axios.post('http://localhost:8080/api/mail', mailData, {
          // 54.213.40.3
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          }
        })
        .then(response => {
          console.log(response.data);
        });
        alert('An email was sent to you confirming your form submission');
      } catch (error) {
        console.error('There was an error emailing your form data! Please try again', error);
        alert('There was an error emailing your form data! Please try again');
        return;
      }

      router.push(`/dashboard?id=${formData.id}&submitted=true`);
      
    } catch (error) {
      console.error('There was an error submitting the form!', error);
      console.error('Payload', formData)
      alert('There was an error submitting the form. Please try again.');
    }
  };

  const checkMissingFields = () => {
    const missingFields: string[] = [];

    if (!formData.first_name) missingFields.push('- First Name');
    if (!formData.last_name) missingFields.push('- Last Name');
    if (!formData.email) missingFields.push('- Email');
    if (!formData.cell_phone) missingFields.push('- Cell Phone');
    if (!formData.home_address) missingFields.push('- Home Address');
    if (!formData.city) missingFields.push('- City');
    if (!formData.state) missingFields.push('- State');
    if (!formData.zip_code) missingFields.push('- Zip Code');
    if (formData.high_school_diploma === null) missingFields.push('- High School Diploma');
    if (formData.college_degree === null) missingFields.push('- College Degree');
    if (!formData.highest_education_level) missingFields.push('- Highest Education Level');
    if (!formData.certifications) missingFields.push('- Certifications');
    if (!formData.skills) missingFields.push('- Job Skills');
    if (formData.availability.overtime === null) missingFields.push('- Overtime Availability');
    if (formData.availability.weekends === null) missingFields.push('- Weekend Availability');
    if (formData.availability.holidays === null) missingFields.push('- Holiday Availability');
    if (formData.availability.second_shift === null) missingFields.push('- Second Shift Availability');
    if (formData.availability.third_shift === null) missingFields.push('- Third Shift Availability');
    if (formData.availability.flex_schedule === null) missingFields.push('- Flexible Schedule Availability');
    if (formData.availability.non_standard_schedule === null) missingFields.push('- Non-Standard Schedule Availability');
    if (!formData.job_title) missingFields.push('- Job Title');
    if (!formData.job_type) missingFields.push('- Job Type');
    if (!formData.employment_type) missingFields.push('- Employment Type');
    if (!formData.available_start_date) missingFields.push('- Available Start Date');
    if (formData.heard_about_r4.length === 0) missingFields.push('- Heard About R4');
    if (!formData.reason_for_looking) missingFields.push('- Reason For Looking');
    if (formData.r4_employee_referral === null) missingFields.push('- R4 Solutions Referral');
    if (formData.r4_employee_referral === true && formData.r4_employee_referral_name === '') missingFields.push('- R4 Referral Name(s)');
    if (formData.current_employment === null) missingFields.push('- Current Employment');
    if (!formData.notice_period) missingFields.push('- Notice Period');
    if (formData.may_contact_current_employer === null) missingFields.push('- May Contact Current Employer');
    if (formData.may_contact_current_employer === false && formData.reasons_no_contact === '') missingFields.push('- Reason for No Employer Contact');
    if (formData.client_employment === null) missingFields.push('- Client Employment');
    if (formData.client_employment === true && formData.client_names === '') missingFields.push('- Client Name(s)');
    if (formData.non_compete === null) missingFields.push('- Non-Compete Certificate');
    if (formData.prevent_servicing_clients === null) missingFields.push('- Client Service Prevention');
    if (formData.drivers_license === null) missingFields.push('- Driver\'s License');
    if (formData.license_suspended === null) missingFields.push('- License Ever Suspended');
    if (formData.has_transportation === null) missingFields.push('- Reliable Transportation');
    if (formData.can_visit_clients === null) missingFields.push('- Can Visit Clients');
    if (formData.right_to_work === null) missingFields.push('- Right to Work');
    if (formData.need_sponsorship === null) missingFields.push('- Need Sponsorship');
    if (formData.covid_vaccinated === null) missingFields.push('- COVID Vaccinated');
    if (formData.will_get_vaccinated === null) missingFields.push('- Will Get Vaccinated');
    if (formData.authorize_verification === null) missingFields.push('- Authorize Release');

    if (formData.college_degree) {
      for (let i = 0; i < education.length; i++) {
          const edu = education[i];
          if (!edu.university_name) missingFields.push(`- Education ${i + 1} University Name`);
          if (!edu.college_name) missingFields.push(`- Education ${i + 1} College Name`);
          if (!edu.degree_type) missingFields.push(`- Education ${i + 1} Degree Type`);
          if (!edu.major) missingFields.push(`- Education ${i + 1} Major`);
          if (!edu.end_date) missingFields.push(`- Education ${i + 1} End Date`);
          if (!edu.city) missingFields.push(`- Education ${i + 1} City`);
          if (!edu.state) missingFields.push(`- Education ${i + 1} State`);
          if (!edu.country) missingFields.push(`- Education ${i + 1} Country`);
      }
    }

    return missingFields;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="w-1/4 bg-white p-6 shadow-md">
        <h1 className="text-xl font-bold mb-4">Application Form</h1><br></br>
        <ul className="list-none">
          {['Basic Information', 'Education', 'Employment History', 'Requirements', 'Referrals', 'Certification and Release'].map((title, index) => (
            <li key={index} className={`mb-4 ${step === index + 1 ? 'text-purple-800 font-bold' : 'text-gray-500'}`}>
              <a href={`#${index + 1}`} className="flex items-center" onClick={() => handleStepClick(index + 1)}>
              <span className="flex items-center">
                <span className="mr-2 h-8 w-8 flex items-center justify-center rounded-full border border-purple-800">
                  {step === index + 1 ? index + 1 : <span className="text-white bg-purple-800 h-8 w-9 flex items-center justify-center rounded-full">{index + 1}</span>}
                </span> {title}
              </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">My Information</h2>
              <p className="text-red-600 mb-2">* Indicates a required field</p>
              <form>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">First Name
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required disabled/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Middle Name</label>
                    <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Last Name
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required disabled/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Preferred Name
                    </label>
                    <input type="text" name="preferred_name" value={formData.preferred_name} onChange={handleChange}  className="w-full p-2 border border-gray-300 rounded"/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Email Address
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required disabled/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Cell Phone
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="cell_phone" value={formData.cell_phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Address
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="home_address" value={formData.home_address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">City
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">State
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Zip Code
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Have you ever worked under any other name? If yes, please list below.</label>
                    <input type="text" name="previous_names" value={formData.previous_names} onChange={handleChange}  className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded mr-2" onClick={() => window.location.href='/dashboard'}>
                    Cancel
                  </button>
                  <button type="button" className="bg-black text-white py-2 px-4 rounded" onClick={handleNext}>
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Education</h2>
              <p className="text-red-600 mb-2">* Indicates a required field</p>
              <form>
                <div className="mb-4">
                  <label className="block font-semibold">
                    Do you have a high school Diploma/GED?
                    <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="high_school_diploma" value="true" checked={formData.high_school_diploma === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="high_school_diploma" value="false" checked={formData.high_school_diploma === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">
                    Do you have a college degree?
                    <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="college_degree" value="true" checked={formData.college_degree === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="college_degree" value="false" checked={formData.college_degree === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    Highest Education Level
                    <span className="text-red-600"> *</span>
                  </label>
                  <input type="text" name="highest_education_level" value={formData.highest_education_level} onChange={handleChange} className="mb-4 w-full p-2 border border-gray-300 rounded" required />
                </div>
                <div className="mt-2 gap-4">
                  {formData.college_degree === true && (
                    <>
                      {education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block mb-1 font-semibold">
                                University Name
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                value={edu.university_name}
                                name="university_name"
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'university_name', index)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                College Name
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                value={edu.college_name}
                                name="college_name"
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'college_name', index)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                Degree Type
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                name="degree_type"
                                value={edu.degree_type}
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'degree_type', index)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                Advanced Degree Type
                              </label>
                              <input
                                type="text"
                                name="advanced_degree_type"
                                value={edu.advanced_degree_type}
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'advanced_degree_type', index)}
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                Major
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                value={edu.major}
                                name="major"
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'major', index)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                Start Date
                                <span className="text-sm"> (ex: 2024-05-31)</span>
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                value={edu.start_date}
                                name="start_date"
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'start_date', index)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                End Date
                                <span className="text-sm"> (ex: 2024-05-31)</span>
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                value={edu.end_date}
                                name="end_date"
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'end_date', index)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                City
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                value={edu.city}
                                name="city"
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'city', index)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                State
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                value={edu.state}
                                name="state"
                                className="mb-4 w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'state', index)}
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold">
                                Country
                                <span className="text-red-600"> *</span>
                              </label>
                              <input
                                type="text"
                                value={edu.country}
                                name="country"
                                className="mb-4 w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleEducationChange(e, 'country', index)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className={`col-span-2 flex ${checkEducationCount() ? 'justify-between' : 'justify-end'}`}>
                        {checkEducationCount() && (
                          <button
                            type="button"
                            className="bg-black text-white py-2 px-4 mb-2 rounded"
                            onClick={() => handleRemoveEducation(education.length - 1)}
                          >
                            Remove Education
                          </button>
                        )}
                        <button
                          type="button"
                          className={`bg-black text-white py-2 px-4 rounded ${checkEducationCount() ? 'mb-2' : ''}`}
                          onClick={handleAddEducation}
                        >
                          Add Education
                        </button>
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">
                      Completed Certifications. Please list all
                      <span className="text-red-600"> *</span>
                    </label>
                    <textarea name="certifications" value={formData.certifications} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">
                      Any other skills you bring to the job?
                      <span className="text-red-600"> *</span>
                    </label>
                    <textarea name="skills" value={formData.skills} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required></textarea>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handlePrevious}>
                    Back
                  </button>
                  <button type="button" className="bg-black text-white py-2 px-4 rounded" onClick={handleNext}>
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Employment History</h2>
              <div className="mb-4">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={() => {handleAddSection();}}
                >
                  + Add Section
                </button>
              </div>
              <div>
              {companies.map((company, index) => (
                <div key={index} className="p-4 border rounded mb-4">
                  <label className="block font-semibold mb-2">{company.company_name}</label>
                  <div className="flex space-x-2">
                    <button
                      className="bg-black text-white py-1 px-4 rounded"
                      onClick={() => {handleEditSection(index); handleWorkHistoryChange({ target: { value: company.company_name } } as React.ChangeEvent<HTMLInputElement>, 'company_name');
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-4 rounded"
                      onClick={() => {handleRemoveSection(index); handleRemoveWorkHistory(index);}}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={handlePrevious}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="bg-black text-white py-2 px-4 rounded"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
              <CompanyModal
                isModalOpen={isModalOpen}
                editCompanyData={editCompanyData}
                handleCloseModal={handleCloseModal}
                handleSave={handleSaveModal}
              />
              {showSuccessMessage && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-700 text-white py-2 px-4 rounded">
                  {successMessage}
                </div>
              )}
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <p className="text-red-600 mb-2">* Indicates a required field</p>
              <form>
                <div className="mb-4">
                  <label className="block font-semibold">Are you willing to work overtime?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="overtime" value="true" checked={formData.availability.overtime === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="overtime" value="false" checked={formData.availability.overtime === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Are you willing to work weekends?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="weekends" value="true" checked={formData.availability.weekends === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="weekends" value="false" checked={formData.availability.weekends === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Are you willing to work holidays?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="holidays" value="true" checked={formData.availability.holidays === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="holidays" value="false" checked={formData.availability.holidays === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Are you willing to work 2nd shifts?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="second_shift" value="true" checked={formData.availability.second_shift === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="second_shift" value="false" checked={formData.availability.second_shift === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Are you willing to work 3rd shifts?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="third_shift" value="true" checked={formData.availability.third_shift === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="third_shift" value="false" checked={formData.availability.third_shift === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Are you willing to work on flexible schedules?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="flex_schedule" value="true" checked={formData.availability.flex_schedule === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="flex_schedule" value="false" checked={formData.availability.flex_schedule === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Are you willing to work on a schedule other than M-F?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="non_standard_schedule" value="true" checked={formData.availability.non_standard_schedule === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="non_standard_schedule" value="false" checked={formData.availability.non_standard_schedule === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Job Title
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Job Type
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="text" name="job_type" value={formData.job_type} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Employment Type
                    <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required>
                        <option value="" disabled>Select</option>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="contract">Contract</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Available Start Date
                    <span className="text-sm">  (ex: 2024-05-31)</span>
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="text" name="available_start_date" value={formData.available_start_date} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    </label>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handlePrevious}>
                    Back
                  </button>
                  <button type="button" className="bg-black text-white py-2 px-4 rounded" onClick={handleNext}>
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Referrals</h2>
              <p className="text-red-600 mb-2">* Indicates a required field</p>
              <form>
                <div className="mb-4">
                  <label className="block font-semibold">How did you hear about R4?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="heard_about_r4" value="LinkedIn" checked={formData.heard_about_r4.includes("LinkedIn")} onChange={handleChange} className="form-checkbox" />
                      <span className="ml-2">LinkedIn</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="heard_about_r4" value="Friends and Family" checked={formData.heard_about_r4.includes("Friends and Family")} onChange={handleChange} className="form-checkbox" />
                      <span className="ml-2">Friends and Family</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="heard_about_r4" value="Social Media" checked={formData.heard_about_r4.includes("Social Media")} onChange={handleChange} className="form-checkbox" />
                      <span className="ml-2">Social Media</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="heard_about_r4" value="Other" checked={formData.heard_about_r4.includes("Other")} onChange={handleChange} className="form-checkbox" />
                      <span className="ml-2">Other</span>
                    </label>
                  </div>
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Why are you looking for a job?
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="reason_for_looking" value={formData.reason_for_looking} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required/>
                  </div>
                <div className="mb-4">
                  <label className="block font-semibold">Do you have an R4 Solutions Referral?
                  <span className="text-red-600"> *</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="r4_employee_referral" value="true" checked={formData.r4_employee_referral === true} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="r4_employee_referral" value="false" checked={formData.r4_employee_referral === false} onChange={handleChange} className="form-radio" />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">If yes, list the name(s)
                      {formData.r4_employee_referral === true && (
                        <span className="text-red-600"> *</span>
                      )}
                    </label>
                    <input type="text" name="r4_employee_referral_name" value={formData.r4_employee_referral_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Are you currently employed?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="current_employment" value="true" checked={formData.current_employment === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="current_employment" value="false" checked={formData.current_employment === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Notice Period
                    <span className="text-red-600"> *</span>
                    </label>
                    <input type="text" name="notice_period" value={formData.notice_period} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required/>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">May we contact your employer?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="may_contact_current_employer" value="true" checked={formData.may_contact_current_employer === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="may_contact_current_employer" value="false" checked={formData.may_contact_current_employer === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">If no, please state reasons
                      {formData.may_contact_current_employer === false && (
                        <span className="text-red-600"> *</span>
                      )}
                    </label>
                    <input type="text" name="reasons_no_contact" value={formData.reasons_no_contact} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Have you worked with any of our clients?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="client_employment" value="true" checked={formData.client_employment === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="client_employment" value="false" checked={formData.client_employment === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">If yes, list the client names
                      {formData.client_employment === true && (
                        <span className="text-red-600"> *</span>
                      )}
                    </label>
                    <input type="text" name="client_names" value={formData.client_names} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Do you have a non compete certificate?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="non_compete" value="true" checked={formData.non_compete === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="non_compete" value="false" checked={formData.non_compete === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Will this prevent servicing/working with our clients? 
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="prevent_servicing_clients" value="true" checked={formData.prevent_servicing_clients === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="prevent_servicing_clients" value="false" checked={formData.prevent_servicing_clients === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Do you have a valid driving license?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="drivers_license" value="true" checked={formData.drivers_license === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="drivers_license" value="false" checked={formData.drivers_license === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Has your driving license ever been revoked or suspended?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="license_suspended" value="true" checked={formData.license_suspended === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="license_suspended" value="false" checked={formData.license_suspended === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Do you have reliable transportation?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="has_transportation" value="true" checked={formData.has_transportation === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="has_transportation" value="false" checked={formData.has_transportation === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Are you willing to drive/service our clients if needed?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="can_visit_clients" value="true" checked={formData.can_visit_clients === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="can_visit_clients" value="false" checked={formData.can_visit_clients === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Do you have the right to work in the U.S.?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="right_to_work" value="true" checked={formData.right_to_work === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="right_to_work" value="false" checked={formData.right_to_work === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">If no, will you require a sponsorship from R4?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="need_sponsorship" value="true" checked={formData.need_sponsorship === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="need_sponsorship" value="false" checked={formData.need_sponsorship === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">Are you vaccinated for COVID-19?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="covid_vaccinated" value="true" checked={formData.covid_vaccinated === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="covid_vaccinated" value="false" checked={formData.covid_vaccinated === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">If our client requires COVID vaccine, will you obtain?
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="will_get_vaccinated" value="true" checked={formData.will_get_vaccinated === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="will_get_vaccinated" value="false" checked={formData.will_get_vaccinated === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-semibold">I authorize any and all former employers, references, or educational institutions to release all information relevant to my employment or education to the Company, without giving me prior notice.
                    <span className="text-red-600"> *</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" name="authorize_verification" value="true" checked={formData.authorize_verification === true} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" name="authorize_verification" value="false" checked={formData.authorize_verification === false} onChange={handleChange} className="form-radio" />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handlePrevious}>
                    Back
                  </button>
                  <button type="button" className="bg-black text-white py-2 px-4 rounded" onClick={handleNext}>
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}
          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Certification and Release</h2>
              <p className="text-red-600 mb-2">* Indicates a required field</p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block font-semibold">Please read carefully each statement and initial.</label>
                  <br></br>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="authorize_verification_1" onChange={handleChange} className="form-checkbox" required/>
                      <span className="ml-2">I authorize the Company to verify, in any manner, all statements made by me. The Company may, for example, interview former employers, co-workers, schools, references, or others and request information and supporting documentation such as transcripts and evaluations.</span>
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  <br></br>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="authorize_verification_2" onChange={handleChange} className="form-checkbox" required/>
                      <span className="ml-2">I authorize any and all former employers, references, or educational institutions to release all information relevant to my employment or education to the Company, without giving me prior notice.</span>
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  <br></br>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="authorize_verification_3" onChange={handleChange} className="form-checkbox" required/>
                      <span className="ml-2">I release from any liability or responsibility all persons, companies and corporations supplying any information in verifying my statements contained in this application, as well as the Company in connection with obtaining such information for use in verifying my statements on this application.</span>
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  <br></br>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="authorize_verification_4" onChange={handleChange} className="form-checkbox" required/>
                      <span className="ml-2">I shall preserve in strictest confidence all information regarding the business or customers of R4 that may be disclosed to me or come to my attention in the process of applying and interviewing for a position with R4 and affiliated companies. If employed by R4, I agree to comply with the Company’s policies and procedures, safety rules, and cooperate in any reasonable security investigation. I understand that I am not employed by or entitled to employment by R4 unless and until I have received and accepted a written offer of employment from a Company representative. I also understand that no other act of the Company, including the acceptance of my application for employment, the scheduling of interviews with me, or any oral or written statements of interest or encouragement, creates an employment relationship with me, and I will not rely on any such act of the Company. I understand that if I am employed by R4, such employment is &quot;at-will,&quot; which means that my employment and related compensation may be terminated at any time, with or without cause, and with or without advance notice by me or by the Company. I understand that any misrepresentation or omission of fact on this application, my resume, my supplementary materials submitted by me, and interview responses, may be cause for a refusal to hire me or the termination of employment at any time during the period of my employment. I have reviewed this application personally, and I agree that all statements I have made on this application, in my resume, and other supplementary materials submitted by me are true and correct. I have not knowingly withheld any information that might adversely affect my chance for employment.</span>
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  <br></br>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="authorize_verification_5" onChange={handleChange} className="form-checkbox" required/>
                      <span className="ml-2">I understand that any offer of employment with R4 will be conditional until drug test and tox screen are passed.</span>
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  <br></br>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="authorize_verification_6" onChange={handleChange} className="form-checkbox" required/>
                      <span className="ml-2">I understand that I must be able to furnish proof of identity and right to work should an offer be made.</span>
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  <br></br>
                  <div className="flex flex-col items-center justify-center">
                    <button type="button" onClick={handleOpenSignatureModal} className=" bg-blue-800 text-white py-2 px-4 rounded mb-2">
                      Sign Here
                    </button>
                      {signature && (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-gray-400 italic">Updated on {formData.signature_date}</span>
                          <img src={signature} alt="Signature" style={{ transform: 'scale(0.65)' }}/>
                        </div>
                      )}
                  </div>
                </div>
                <SignatureModal
                  isModalOpen={isSignatureModalOpen}
                  handleCloseModal={handleCloseSignatureModal}
                  handleSaveSignature={handleSaveSignature}
                />
                <div className="flex justify-between mt-4">
                  <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handlePrevious}>
                    Back
                  </button>
                  <button type="submit" className="bg-black text-white py-2 px-4 rounded">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
