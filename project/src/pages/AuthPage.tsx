import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Helmet } from '../components/utils/Helmet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import your custom logo
import logo from '../../src/assets/anantam-logo.png'; // Adjust the path according to your assets structure

// Configure axios base URL
const API_BASE_URL = 'https://anantam-backend-7ezq.onrender.com/api';
axios.defaults.baseURL = API_BASE_URL;

// Type definitions
interface FormData {
  name: string;
  email: string;
  password: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface ApiResponse {
  token: string;
  user?: UserData;
  message?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint: string = isLogin ? '/auth/signin' : '/auth/signup';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await axios.post(endpoint, payload);
      const data: ApiResponse = response.data;
  
      if (isLogin) {
        // Save token and user data to localStorage
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Check user role and redirect accordingly
        if (data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert('Signup successful. Please sign in.');
        setIsLogin(true);
        // Clear form data
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 
                          apiError.response?.data?.error || 
                          'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  const toggleForm = (): void => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };
  
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleGoogleAuth = (): void => {
    window.location.href = 'https://anantam-backend-7ezq.onrender.com/api/auth/google';
  };

  const handleGitHubAuth = (): void => {
    // Add GitHub auth logic here
    console.log('GitHub auth clicked');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-16 bg-dark-900"
    >
      <Helmet title={isLogin ? "Sign In | Anantam Aerials and Robotics" : "Sign Up | Anantam Aerials and Robotics"} />
      
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="card p-8">
            <div className="text-center mb-8">
              <img 
                src={logo} 
                alt="Anantam Aerial Logo" 
                className="h-12 w-12 mx-auto mb-4 object-contain"
              />
              <h1 className="text-2xl font-bold">
                {isLogin ? 'Sign In to Anantam Aerials and Robotics' : 'Create Your Account'}
              </h1>
              <p className="text-gray-400 mt-2">
                {isLogin 
                  ? 'Access exclusive services and products' 
                  : 'Join us to access workshops and services'}
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="label">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      id="name"
                      className="input pl-10"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="input pl-10"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="input pl-10 pr-10"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-primary-400 hover:text-primary-300">
                    Forgot password?
                  </a>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="text-red-400 text-sm text-center">
                    {error}
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  className="ml-2 text-primary-400 hover:text-primary-300 font-medium"
                  onClick={toggleForm}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
            
            {isLogin && (
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dark-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dark-700 text-gray-400">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="btn-outline w-full"
                    onClick={handleGoogleAuth}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="btn-outline w-full"
                    onClick={handleGitHubAuth}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;