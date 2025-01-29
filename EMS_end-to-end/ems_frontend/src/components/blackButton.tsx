import Link from 'next/link';

interface BlackButtonProps {
  href: string;
  text: string;
}

export default function BlackButton({ href, text }: BlackButtonProps) {
  return (
    <Link href={href} legacyBehavior>
      <a className="inline-block px-4 py-2 text-white bg-black rounded hover:bg-gray-800">
        {text}
      </a>
    </Link>
  );
}
