import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthProvider';

const Register = () => {
  const { createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    try {
      const userCredential = await createUser(email, password);
      await updateUserProfile({ displayName: name });

      Swal.fire('Success!', 'Account created successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      Swal.fire('Success!', 'Signed up with Google.', 'success');
      navigate('/dashboard');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create a new account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            Register
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">OR</div>

        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl mr-2" />
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
