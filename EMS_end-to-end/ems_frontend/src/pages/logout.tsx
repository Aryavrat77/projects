import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">You have successfully logged out!</h1>
      <p className="text-gray-600 mb-4">In 5 seconds, you will be redirected to the sign-in page.</p>
      <div className="text-gray-600 text-sm">Alternatively, <Link href="/dashboard" className="underline">click here</Link> to go back to the dashboard immediately.</div>
    </div>
  );
};

export default LogoutPage;