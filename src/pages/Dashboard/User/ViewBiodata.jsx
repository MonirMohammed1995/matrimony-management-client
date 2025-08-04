import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthProvider';
import Swal from 'sweetalert2';

const ViewBiodata = () => {
  const { user } = useContext(AuthContext);
  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiodata = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/biodatas/${user?.email}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setBiodata(data.biodata);
        }
      } catch (error) {
        console.error('Error fetching biodata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchBiodata();
    }
  }, [user]);

  const handleMakePremium = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to request premium status?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/biodatas/request-premium/${user?.email}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          Swal.fire('Requested!', 'Your biodata has been sent for approval.', 'success');
        } else {
          Swal.fire('Error', data.message || 'Failed to request premium.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!biodata) return <div className="text-center mt-10">No biodata found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white shadow-lg rounded-xl p-6 border">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Your Biodata</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 text-center mb-4">
            <img src={biodata.photoURL} alt="Profile" className="w-40 h-40 object-cover rounded-full mx-auto border border-gray-300" />
          </div>

          <p><strong>Biodata Type:</strong> {biodata.biodataType}</p>
          <p><strong>Name:</strong> {biodata.name}</p>
          <p><strong>Date of Birth:</strong> {biodata.dateOfBirth}</p>
          <p><strong>Age:</strong> {biodata.age}</p>
          <p><strong>Height:</strong> {biodata.height}</p>
          <p><strong>Weight:</strong> {biodata.weight}</p>
          <p><strong>Occupation:</strong> {biodata.occupation}</p>
          <p><strong>Race (Skin Color):</strong> {biodata.race}</p>
          <p><strong>Blood Type:</strong> {biodata.bloodType}</p>
          <p><strong>Hair Type:</strong> {biodata.hairType}</p>
          <p><strong>Father's Name:</strong> {biodata.fatherName}</p>
          <p><strong>Mother's Name:</strong> {biodata.motherName}</p>
          <p><strong>Permanent Division:</strong> {biodata.permanentDivision}</p>
          <p><strong>Present Division:</strong> {biodata.presentDivision}</p>
          <p><strong>Expected Partner Age:</strong> {biodata.expectedPartnerAge}</p>
          <p><strong>Expected Partner Height:</strong> {biodata.expectedPartnerHeight}</p>
          <p><strong>Expected Partner Weight:</strong> {biodata.expectedPartnerWeight}</p>
          <p><strong>Contact Email:</strong> {biodata.email}</p>
          <p><strong>Mobile Number:</strong> {biodata.phoneNumber}</p>
        </div>

        {!biodata.isPremium ? (
          <div className="text-center mt-8">
            <button
              onClick={handleMakePremium}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded shadow"
            >
              Make Biodata Premium
            </button>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-green-600 font-semibold">This biodata is already premium.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBiodata;