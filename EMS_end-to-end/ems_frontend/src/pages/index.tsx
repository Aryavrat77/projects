import Image from 'next/image';
import SigninForm from '@/components/signinForm';
import BlackButton from '@/components/blackButton';
import logo from '@/public/logo.jpeg';
import background from '@/public/background.jpg';
import React, { useEffect } from 'react';

const expiredPopup = () => {
  localStorage.removeItem('expired');
  const popup = document.createElement('div');
  popup.textContent = 'Session expired!';
  popup.style.position = 'fixed';
  popup.style.bottom = '10px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.padding = '10px';
  popup.style.backgroundColor = 'red';
  popup.style.color = 'white';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '9999';

  document.body.appendChild(popup);

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 5000);
};

const Home = () => {
  useEffect(() => {
    const isExpired = localStorage.getItem('expired') === 'true';
    if (isExpired) {
      expiredPopup();
    }
  }, []);

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex items-start justify-start p-4">
        <Image src={logo} alt="Company Logo" width={150} height={50} />
      </div>
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-3">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Welcome to the R4 Account Page</h1>
            <p className="text-gray-600 mb-6">Manage your account with ease.</p>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in
            </h2>
          </div>
          <br></br>
          <SigninForm />
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-800 mb-6">Don&apos;t have an account?</p>
            <BlackButton href="/sign-up" text="Sign up" />
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 h-full bg-cover bg-center relative">
        <Image src={background} alt="Background" style={{ objectFit: 'cover' }} className="z-0 pl-7" /> 
      </div>
    </div>
  );
};

export default Home;
