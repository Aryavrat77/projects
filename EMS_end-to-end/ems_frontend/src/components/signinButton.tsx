import Link from 'next/link';

interface ButtonProps {
  href: string;
  text: string;
  disabled: boolean;
}

export default function SignInButton({ href, text, disabled }: ButtonProps) {
  return (
    <Link href={href} legacyBehavior>
      <a
        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
          disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
      >
        {text}
      </a>
    </Link>
  );
}
