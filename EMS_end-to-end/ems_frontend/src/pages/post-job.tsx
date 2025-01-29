import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';
import { useRouter } from 'next/router';

const PostJob: React.FC = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobLocation: '',
    salaryRange: '',
    jobType: '',
    jobDescription: '',
    jobRequirements: '',
    jobDeadline: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobTitle || !formData.jobLocation || !formData.salaryRange || !formData.jobType || !formData.jobDescription || !formData.jobRequirements || !formData.jobDeadline) {
      alert('Please fill in all fields');
      return;
    }

    const newJob = {
      title: formData.jobTitle,
      description: formData.jobDescription,
      tags: [formData.jobType, 'Hybrid'],
      timeAgo: 'Just Now',
      deadline: formData.jobDeadline,
    };

    const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    localStorage.setItem('jobs', JSON.stringify([...existingJobs, formData])); //newJob

    router.push('/job-portal');
  };

  const handleCancel = () => {
    router.push('/job-portal');
  };

  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
        <p className="text-gray-400 mb-8">Fill out the form below to post a new job listing.</p>
        <hr className="border-gray-300 my-4"/>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-12 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4 flex">
            <div className="w-1/2 pr-2">
              <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobTitle">
                Job Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jobTitle"
                type="text"
                placeholder="Ex: Software Developer"
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobLocation">
                Job Location
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jobLocation"
                type="text"
                placeholder="Ex: SF Bay Area"
                value={formData.jobLocation}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* <div className="mb-4">
            <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobTitle">Job Title</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="jobTitle"
              type="text"
              placeholder="Ex: Software Developer"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobLocation">Job Location</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="jobLocation"
              type="text"
              placeholder="Ex: SF Bay Area"
            />
          </div> */}
          <div className="mb-4 flex">
            <div className="w-1/2 pr-2">
              <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="salaryRange">
                Salary Range
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="salaryRange"
                type="text"
                placeholder="Ex: 80K-100K/year"
                value={formData.salaryRange}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobType">
                Job Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>
          {/* <div className="mb-4">
            <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="salaryRange">Salary Range</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="salaryRange"
              placeholder="Ex: 80K-100K/year"
            />
          </div> */}
          {/* <div className="mb-4">
            <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobType">Job Type</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="jobType"
              placeholder="Ex: Internship"
            />
          </div> */}
          {/* <div className="mb-4">
            <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobType">Job Type</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="jobType"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div> */}
          <div className="mb-4">
            <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobDescription">Job Description</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="jobDescription"
              placeholder="Job Description Details (ex: role, hybrid, etc.)"
              value={formData.jobDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobRequirements">Requirements</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="jobRequirements"
              placeholder="Job Requirements Details"
              value={formData.jobRequirements}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="jobDeadline">Deadline to Apply</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="jobDeadline"
              placeholder="Ex: 04/19/24"
              value={formData.jobDeadline}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between">
          <button className="absolute right-40 bg-white border border-gray-300 text-black py-0.5 px-2 rounded" type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="absolute right-12 bg-black text-white py-0.5 px-2 rounded" type="submit">
              Post Job
            </button>
          </div>
        </form>
        </div>
    </div>
  );
};

export default PostJob;