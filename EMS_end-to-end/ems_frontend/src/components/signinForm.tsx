import { useState } from 'react';
import Link from 'next/link';
import SignInButton from './signinButton';
import Image from 'next/image';
import teams from '@/public/teams.png';

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FormData | null>(null);



  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = () => {
    return password.length >= 6;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginData = {
      usernameOrEmail: email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8080/auth/login', { //54.213.40.3
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('jwtToken', data.jwtToken);
      localStorage.setItem('employeeId', data.employeeId);
      console.log('Login successful:', data);
      // Redirect to the dashboard or another page as needed

      window.location.href = `/dashboard?id=${data.employeeId}`;
    } catch (error) {
      console.error('Error:', error);
      if (!validateEmail()) setErrorMessage('Invalid email address.');
      else setErrorMessage('Invalid account credentials. Try signing up.');
    }
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <div className="mt-1 mb-6 flex items-center justify-between">
        <div className="text-sm">
          <Link href="/forgot-password" legacyBehavior>
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <button
          type="button"
          className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <div className="flex items-center">
            <Image src={teams} alt="Teams Logo" width={20} height={20} className="mr-2" />
            <span>Sign in with Teams</span>
          </div>
        </button>
      </div>
    </form>
  );
};

export default SigninForm;
