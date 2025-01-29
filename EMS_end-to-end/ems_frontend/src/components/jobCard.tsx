import BlackButton from './blackButton';

interface JobCardProps {
  title: string;
  description: string;
  tags: string[];
  timeAgo: string;
  deadline: string;
}

export default function JobCard({ title, description, tags, timeAgo, deadline }: JobCardProps) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm border border-black">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <span className="text-sm text-gray-500">{timeAgo}</span>
      </div>
      <p className="mt-2 text-gray-700">{description}</p>
      <div className="mt-3">
        {tags.map((tag, index) => (
          <span key={index} className="inline-block px-3 py-1 mr-2 text-sm text-blue-700 bg-blue-200 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <span className="text-sm text-gray-500">Deadline {deadline}</span>
        <BlackButton href="#" text="View Stats" />
      </div>
    </div>
  );
}
