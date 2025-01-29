import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const SignupForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [roleTouched, setRoleTouched] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseError, setResponseError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    validateForm();
  }, [firstName, lastName, email, password, role]);

  const validateForm = () => {
    const isFirstNameValid = validateName(firstName);
    const isLastNameValid = validateName(lastName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);
    const isRoleValid = validateRole(role);

    setIsFormValid(
      isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isRoleValid
    );
  };

  const validateName = (name: string) => {
    return name.trim().length > 0;
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    return confirmPassword === password;
  };

  const validateRole = (role: string) => {
    return role.trim().length > 0;
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setRoleTouched(true);
  };

  const handleFirstNameBlur = () => {
    setFirstNameTouched(true);
  };

  const handleLastNameBlur = () => {
    setLastNameTouched(true);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form redirection
    console.log('Form submitted'); // Log for debugging

    if (!isFormValid) {
      setResponseMessage('Please fill out all fields correctly.');
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      role,
    };

    console.log('Sending request with payload:', payload); // Log for debugging

    try {
      const response = await fetch('http://localhost:8080/auth/signup', { //54.213.40.3
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setResponseMessage('Signup successful! Redirecting to home page...');
        setResponseError(false);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const errorData = await response.json();
        if (response.status === 409) { // Conflict, employee already exists
          setResponseMessage('Employee already exists. Try logging in.');
          setResponseError(true);
        } else {
          setResponseMessage(`Signup failed: ${errorData.message}`);
          setResponseError(true);
        }
      }
    } catch (error) {
      console.error('Error during signup:', error); // Log for debugging
      setResponseMessage('Unable to connect to the server.');
      setResponseError(true);
    }

    try {
      const mailData = new FormData();
      mailData.append('to', payload.email);
      mailData.append('subject', 'R4 Account Sign Up Successful!');
      mailData.append('body', `Hi ${payload.firstName} ${payload.lastName},\n\tCongratulations, your R4 account sign up was successful. The role used to sign up was ${payload.role} for email: ${payload.email}. Log in to access your account now.\n\nRegards,\nR4 Team`);
      console.log(mailData);
      await axios.post('http://localhost:8080/api/mail', mailData, { //54.213.40.3
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response.data);
      });
      alert('An email was sent to you confirming your sign up.');
    } catch (error) {
      console.error('There was an error emailing your sign up! Please try again', error);
      alert('There was an error emailing your sign up! Please try again');
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="firstName" className="sr-only">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={handleFirstNameChange}
              onBlur={handleFirstNameBlur}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your first name"
            />
            {firstNameTouched && !validateName(firstName) &&
              <p className="mx-1 text-red-500 text-sm mt-1">This field is required.</p>
            }
          </div>
          <div className="w-1/2">
            <label htmlFor="lastName" className="sr-only">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={handleLastNameChange}
              onBlur={handleLastNameBlur}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your last name"
            />
            {lastNameTouched && !validateName(lastName) &&
              <p className="mx-1 text-red-500 text-sm mt-1">This field is required.</p>
            }
          </div>
        </div>
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
            onBlur={handleEmailBlur}
          />
          {emailTouched && !validateEmail(email) &&
            <p className="mx-1 text-red-500 text-sm mt-1">Invalid email address.</p>
          }
        </div>
        <div className="relative">
          <label htmlFor="password" className="sr-only">Password</label>
          <div className="flex relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordTouched && !validatePassword(password) && (
            <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters.</p>
          )}
        </div>
        <div className="relative">
          <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
          <div className="flex relative">
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {confirmPasswordTouched && !validateConfirmPassword(confirmPassword, password) && (
            <p className="text-red-500 text-sm mt-1">Must match your password.</p>
          )}
        </div>
        <div className="flex justify-center">
          <label htmlFor="role" className="text-sm font-medium text-gray-800 mb-1">Select your role</label>
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-4">
            <button
              type="button"
              className={`px-3 py-2 rounded-md text-sm font-medium ${role === 'EMPLOYEE' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'}`}
              onClick={() => handleRoleChange('EMPLOYEE')}
            >
              Employee
            </button>
            <button
              type="button"
              className={`px-3 py-2 rounded-md text-sm font-medium ${role === 'HR' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'}`}
              onClick={() => handleRoleChange('HR')}
            >
              HR
            </button>
          </div>
          {roleTouched && !validateRole(role) && (
            <p className="text-red-500 text-sm mt-1">This field is required.</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={!isFormValid}
        >
          Create your account
        </button>
      </div>

      {responseMessage && (
        <div className={`text-center text-${responseError ? 'red' : 'green'}-500 mt-4`}>{responseMessage}</div>
      )}
    </form>
  );
};

export default SignupForm;
