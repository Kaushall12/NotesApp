import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, guestLogin, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse);
      navigate('/');
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
      navigate('/');
    } catch (error) {
      console.error('Failed to login as guest', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel p-10 rounded-2xl shadow-2xl flex flex-col items-center max-w-md w-full relative z-10"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center mb-8"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Cloud Notes</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">Capture your thoughts, ideas, and tasks seamlessly.</p>
        
        <div className="w-full flex justify-center hover:scale-105 transition-transform duration-300">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
            shape="pill"
            theme="outline"
            size="large"
          />
        </div>

        <div className="relative flex py-5 items-center w-full">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm font-medium">or</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGuestLogin}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Continue as Guest
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
