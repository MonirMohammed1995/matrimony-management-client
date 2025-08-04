import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthProvider';
import Swal from 'sweetalert2';

// Constant arrays
const divisions = [ 'Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh' ];
const occupations = [ 'Student', 'Engineer', 'Doctor', 'Teacher', 'Business', 'Freelancer', 'Other' ];
const heights = [ 'Below 150 cm', '150-160 cm', '161-170 cm', '171-180 cm', 'Above 180 cm' ];
const weights = [ 'Below 50 kg', '50-60 kg', '61-70 kg', '71-80 kg', 'Above 80 kg' ];
const races = [ 'Fair', 'Medium', 'Dark' ];
const bloodTypes = [ 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-' ];
const hairTypes = [ 'Straight', 'Wavy', 'Curly', 'Coily' ];
const genders = [ 'male', 'female' ];

// Utility
const calculateAge = dob => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : '';
};

const AddBioData = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    biodataType: '',
    name: '',
    photoURL: '',
    dateOfBirth: '',
    age: '',
    height: '',
    weight: '',
    occupation: '',
    race: '',
    bloodType: '',
    hairType: '',
    fatherName: '',
    motherName: '',
    permanentDivision: '',
    presentDivision: '',
    expectedPartnerAge: '',
    expectedPartnerHeight: '',
    expectedPartnerWeight: '',
    phoneNumber: '',
    email: user?.email || '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'dateOfBirth') {
      const age = calculateAge(value);
      setFormData(prev => ({ ...prev, dateOfBirth: value, age }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const biodata = { ...formData, isPremium: false };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/biodatas/${user?.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(biodata),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire('Success', data.message || 'Biodata saved!', 'success');
        setFormData({
          biodataType: '',
          name: '',
          photoURL: '',
          dateOfBirth: '',
          age: '',
          height: '',
          weight: '',
          occupation: '',
          race: '',
          bloodType: '',
          hairType: '',
          fatherName: '',
          motherName: '',
          permanentDivision: '',
          presentDivision: '',
          expectedPartnerAge: '',
          expectedPartnerHeight: '',
          expectedPartnerWeight: '',
          phoneNumber: '',
          email: user?.email || '',
        });
      } else {
        Swal.fire('Info', data.message || 'Could not save biodata.', 'info');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to submit biodata.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Biodata</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Repeatable input fields */}
            {[
              { label: 'Biodata Type', name: 'biodataType', type: 'select', options: genders },
              { label: 'Name', name: 'name' },
              { label: 'Profile Image URL', name: 'photoURL', type: 'url' },
              { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', max: new Date().toISOString().split('T')[0] },
              { label: 'Age', name: 'age', type: 'number', readOnly: true },
              { label: 'Height', name: 'height', type: 'select', options: heights },
              { label: 'Weight', name: 'weight', type: 'select', options: weights },
              { label: 'Occupation', name: 'occupation', type: 'select', options: occupations },
              { label: 'Race (Skin Color)', name: 'race', type: 'select', options: races },
              { label: 'Blood Type', name: 'bloodType', type: 'select', options: bloodTypes },
              { label: 'Hair Type', name: 'hairType', type: 'select', options: hairTypes },
            ].map(({ label, name, type = 'text', options = [], ...rest }) => (
              <div key={name}>
                <label className="label font-semibold">{label}</label>
                {type === 'select' ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select</option>
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${rest.readOnly ? 'bg-gray-100' : ''}`}
                    {...rest}
                    required
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {[
              { label: "Father's Name", name: 'fatherName' },
              { label: "Mother's Name", name: 'motherName' },
              { label: 'Permanent Division', name: 'permanentDivision', type: 'select', options: divisions },
              { label: 'Present Division', name: 'presentDivision', type: 'select', options: divisions },
              { label: 'Expected Partner Age', name: 'expectedPartnerAge', type: 'number' },
              { label: 'Expected Partner Height', name: 'expectedPartnerHeight', type: 'select', options: heights },
              { label: 'Expected Partner Weight', name: 'expectedPartnerWeight', type: 'select', options: weights },
              { label: 'Mobile Number', name: 'phoneNumber' },
              { label: 'Email', name: 'email', type: 'email', readOnly: true },
            ].map(({ label, name, type = 'text', options = [], ...rest }) => (
              <div key={name}>
                <label className="label font-semibold">{label}</label>
                {type === 'select' ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select</option>
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${rest.readOnly ? 'bg-gray-100 text-gray-600' : ''}`}
                    {...rest}
                    required
                  />
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center mt-6">
            <button type="submit" className="btn btn-primary px-10" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Publish Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBioData;
