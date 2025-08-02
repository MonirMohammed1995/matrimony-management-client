import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthProvider';

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      Swal.fire('Oops!', 'Please fill in all fields.', 'warning');
      return;
    }

    try {
      await signIn(email, password);
      Swal.fire('Success!', 'Logged in successfully.', 'success');
      navigate('/');
    } catch (err) {
      Swal.fire('Error', err.message || 'Login failed.', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      Swal.fire('Success!', 'Logged in with Google.', 'success');
      navigate('/');
    } catch (err) {
      Swal.fire('Error', err.message || 'Google login failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl mr-2" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
