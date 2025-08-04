// src/pages/BiodataDetails/BiodataDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BiodataDetails = () => {
  const { id } = useParams();
  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiodataDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/biodatas/${id}`);
        if (!res.ok) throw new Error('Failed to fetch biodata details');
        const data = await res.json();
        setBiodata(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBiodataDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading biodata details...</p>;
  }

  if (!biodata) {
    return <p className="text-center mt-10 text-red-500">Biodata not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-3xl font-semibold mb-6">{biodata.name}</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={biodata.photoURL || '/default-profile.png'}
          alt={biodata.name}
          className="w-48 h-48 rounded-lg object-cover mx-auto md:mx-0"
        />
        <div className="flex-1">
          <p><strong>Age:</strong> {biodata.age}</p>
          <p><strong>Gender:</strong> {biodata.gender}</p>
          <p><strong>Occupation:</strong> {biodata.occupation}</p>
          <p><strong>Religion:</strong> {biodata.religion}</p>
          <p><strong>Permanent Division:</strong> {biodata.permanentDivision}</p>
          <p><strong>Present Division:</strong> {biodata.presentDivision}</p>
          <p><strong>Height:</strong> {biodata.height} cm</p>
          <p><strong>Weight:</strong> {biodata.weight} kg</p>
          <p><strong>Expected Partner Age:</strong> {biodata.expectedPartnerAge}</p>
          <p><strong>Expected Partner Height:</strong> {biodata.expectedPartnerHeight} cm</p>
          <p><strong>Expected Partner Weight:</strong> {biodata.expectedPartnerWeight} kg</p>
          <p><strong>Contact Email:</strong> {biodata.contactEmail}</p>
          <p><strong>Phone Number:</strong> {biodata.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default BiodataDetails;
