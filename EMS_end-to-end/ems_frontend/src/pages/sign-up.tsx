import SignupForm from '@/components/signupForm';
import BlackButton from '@/components/blackButton';

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-3">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl mb-1 font-bold">Create an Account</h1>
            <p className="text-gray-600 text-center">Create your R4 account by providing the information requested below.</p>
          </div>
          <br />
          <SignupForm />
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-800 mb-3">Already have an account?</p>
            <BlackButton href="/" text="Log in" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
