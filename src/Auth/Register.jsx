import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '../firebase/firebase.config';

const Register = () => {
  const provider = new GoogleAuthProvider();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    photo: '',
    role: 'user',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveUserToDB = async (user, role = 'user') => {
    const userInfo = {
      name: user.displayName || 'No Name',
      email: user.email,
      photo: user.photoURL || '',
      role: role,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, photo, role } = form;

    if (!name || !email || !password || !photo) {
      return Swal.fire('Error', 'Please fill in all fields.', 'warning');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });

      await saveUserToDB(auth.currentUser, role);

      Swal.fire('Success!', 'Account created successfully.', 'success');
      setForm({ name: '', email: '', password: '', photo: '', role: 'user' });
      navigate('/dashboard');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToDB(result.user, 'user'); // force default role
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
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="photo"
            value={form.photo}
            onChange={handleChange}
            placeholder="Photo URL"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

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