import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import JobCard from '../components/jobCard';
import BlackButton from '../components/blackButton';

const jobs = [
  {
    title: 'Senior Software Developer',
    description: 'We are looking for an experienced Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining our web applications.',
    tags: ['Full Time', 'Senior', 'Hybrid'],
    timeAgo: '1 Day Ago',
    deadline: '04/12/24',
  },
  {
    title: 'Software Developer Intern',
    description: 'We are looking for an experienced Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining our web applications.',
    tags: ['Internship', 'Hybrid'],
    timeAgo: '5 Days Ago',
    deadline: '04/12/24',
  },
];

// interface Job {
//   title: string;
//   description: string;
//   tags: string[];
//   timeAgo: string;
//   deadline: string;
// }

export default function JobPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  // const [jobs, setJobs] = useState<Job[]>([]);

  // useEffect(() => {
    // const storedJobs = localStorage.getItem('jobs');
    // if (storedJobs) {
    //   setJobs(JSON.parse(storedJobs));
    // }
  // }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearchQuery = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilterTag = filterTag === '' || job.tags.includes(filterTag);
    return matchesSearchQuery && matchesFilterTag;
  });

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job Openings</h1>
          <BlackButton href="/post-job" text="Post New Job" />
        </div>
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search jobs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="Full Time">Full Time</option>
            <option value="Senior">Senior</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        {filteredJobs.map((job, index) => (
          <div key={index} className="mb-6">
            <JobCard
              title={job.title}
              description={job.description}
              tags={job.tags}
              timeAgo={job.timeAgo}
              deadline={job.deadline}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
