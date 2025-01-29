import React, { useState, useEffect } from 'react';

interface CompanyData {
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
}

interface Props {
  isModalOpen: boolean;
  editCompanyData: CompanyData | null;
  handleCloseModal: () => void;
  handleSave: (companyData: CompanyData) => void;
}

const CompanyModal: React.FC<Props> = ({
  isModalOpen,
  editCompanyData,
  handleCloseModal,
  handleSave,
}) => {
  const [companyData, setCompanyData] = useState<CompanyData>({
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
  });

  const [initialCompanyName, setInitialCompanyName] = useState('');

  useEffect(() => {
    if (isModalOpen && editCompanyData) {
      setCompanyData({
        ...editCompanyData,
      });
      setInitialCompanyName(editCompanyData.company_name);
    } else {
      setCompanyData({
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
      });
    }
  }, [isModalOpen, editCompanyData]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month: number | string = today.getMonth() + 1;
    let day: number | string = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const isModalValid = () => {
    return (
      companyData.company_name.trim() === '' ||
      companyData.employer_name.trim() === '' ||
      companyData.position.trim() === '' ||
      companyData.duties.trim() === '' ||
      companyData.manager_name.trim() === '' ||
      companyData.phone.trim() === '' ||
      companyData.start_date.trim() === '' ||
      companyData.end_date.trim() === '' ||
      companyData.reason_for_leaving.trim() === ''
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCompanyData({ ...companyData, [name]: checked });
  };

  return !isModalOpen ? null : (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="text-2xl font-bold mb-1">
          {!initialCompanyName ? 'Add' : 'Edit'} Employment History
        </h2>
        <p className="text-red-600 mb-4">* Indicates a required field</p>
        <div className="mb-2">
          <label className="text-gray-550 mb-1">Company Name</label>
          <span className="text-red-600"> *</span>
          <input
            name="company_name"
            type="text"
            value={companyData.company_name}
            onChange={handleInputChange}
            className="w-full p-1 border border-gray-300 rounded"
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <label className="text-gray-550 mb-1">Employer Name</label>
            <span className="text-red-600"> *</span>
            <input
              name="employer_name"
              type="text"
              value={companyData.employer_name}
              onChange={handleInputChange}
              className="w-full p-1 border border-gray-300 rounded"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-gray-550 mb-1">Manager Name</label>
            <span className="text-red-600"> *</span>
            <input
              name="manager_name"
              type="text"
              value={companyData.manager_name}
              onChange={handleInputChange}
              className="w-full p-1 border border-gray-300 rounded"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-gray-550 mb-1">Position</label>
            <span className="text-red-600"> *</span>
            <input
              name="position"
              type="text"
              value={companyData.position}
              onChange={handleInputChange}
              className="w-full p-1 border border-gray-300 rounded"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-gray-550 mb-1">Work Duties</label>
            <span className="text-red-600"> *</span>
            <input
              name="duties"
              type="text"
              value={companyData.duties}
              onChange={handleInputChange}
              className="w-full p-1 border border-gray-300 rounded"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-gray-550 mb-1">Industry</label>
            <span className="text-red-600"> *</span>
            <input
              name="industry"
              type="text"
              value={companyData.industry}
              onChange={handleInputChange}
              className="w-full p-1 border border-gray-300 rounded"
              min="1950-01-01"
              max={getTodayDate()}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-gray-550 mb-1">Phone Number</label>
            <span className="text-red-600"> *</span>
            <input
              name="phone"
              type="tel"
              value={companyData.phone}
              onChange={handleInputChange}
              className="w-full p-1 border border-gray-300 rounded"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              autoComplete="on"
            />
          </div>
          <div>
            <label className="text-gray-550 mb-1">Start Date</label>
            <span className="text-red-600"> *</span>
            <input
              name="start_date"
              type="date"
              value={companyData.start_date}
              onChange={handleInputChange}
              className="w-full p-1 border border-gray-300 rounded"
              min="1950-01-01"
              max={getTodayDate()}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-gray-550 mb-1">End Date</label>
            <span className="text-red-600"> *</span>
            <input
              name="end_date"
              type="date"
              value={companyData.end_date}
              onChange={handleInputChange}
              className="w-full p-1 border border-gray-300 rounded"
              min={!companyData.start_date ? "1950-01-01" : companyData.start_date}
              max="2050-12-31"
              autoComplete="off"
            />
          </div>
        </div>
        <label className="text-gray-550 mb-1">Reasons for Leaving</label>
        <span className="text-red-600"> *</span>
        <textarea
          name="reason_for_leaving"
          value={companyData.reason_for_leaving}
          onChange={handleInputChange}
          className="w-full p-1 border border-gray-300 rounded"
          autoComplete="off"
          style={{ height: '100px' }}
          wrap="soft"
        />
        <div className="flex justify-end space-x-4">
          <button className="bg-gray-500 text-white py-2 px-4 mt-4 rounded" onClick={handleCloseModal}>
            Cancel
          </button>
          <button
            className={`bg-blue-600 text-white py-2 px-4 mt-4 rounded ${isModalValid() ? 'bg-gray-400 cursor-not-allowed' : ''}`}
            onClick={() => handleSave(companyData)}
            disabled={isModalValid()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;