import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthProvider';

// --- Reusable InfoRow Component ---
const InfoRow = ({ label, value }) => (
  <p>
    <span className="font-medium">{label}:</span> {value ?? 'N/A'}
  </p>
);

// --- BiodataCard Component for Similar Items ---
const BiodataCard = ({ bio, onClick }) => (
  <div
    onClick={onClick}
    tabIndex={0}
    role="button"
    className="cursor-pointer p-4 bg-gray-50 border rounded-lg shadow hover:shadow-md transition flex flex-col items-center"
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <img
      src={bio.photoURL || '/default-profile.png'}
      alt={bio.name ?? 'Profile Image'}
      className="w-full h-40 object-cover rounded"
      loading="lazy"
    />
    <h4 className="mt-3 text-lg font-semibold capitalize">{bio.name ?? 'Unnamed'}</h4>
    <p>Age: {bio.age ?? 'N/A'}</p>
    <p>Division: {bio.presentDivision ?? 'N/A'}</p>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="mt-3 text-sm text-blue-600 hover:underline focus:outline-none"
    >
      View Details
    </button>
  </div>
);

// --- Custom Hook to Fetch Biodata and Similar Profiles ---
const useBiodataDetails = (id) => {
  const [biodata, setBiodata] = useState(null);
  const [similarBiodatas, setSimilarBiodatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const fetchDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/biodatas/${id}`);
        if (!res.ok) throw new Error('Failed to fetch biodata details');
        const data = await res.json();
        setBiodata(data);

        // Fetch similar biodatas by gender excluding current id
        const similarRes = await fetch(
          `${import.meta.env.VITE_API_URL}/biodatas/similar?gender=${encodeURIComponent(data.gender)}&exclude=${id}`
        );
        if (!similarRes.ok) throw new Error('Failed to fetch similar biodatas');
        const similarData = await similarRes.json();
        setSimilarBiodatas(similarData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return { biodata, similarBiodatas, loading, error };
};

const BiodataDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userInfo } = useContext(AuthContext);

  const { biodata, similarBiodatas, loading, error } = useBiodataDetails(id);

  // --- Add to Favourites Handler ---
  const handleAddToFavourites = useCallback(async () => {
    if (!user) {
      return Swal.fire('Login Required', 'Please log in to add favourites.', 'warning');
    }

    if (!biodata?._id) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/favourites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biodataId: biodata._id,
          userEmail: user.email,
          addedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        Swal.fire('Success', 'Added to favourites!', 'success');
      } else if (res.status === 409) {
        Swal.fire('Info', 'Already in your favourites!', 'info');
      } else {
        throw new Error('Failed to add to favourites');
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Something went wrong', 'error');
    }
  }, [user, biodata]);

  // --- Navigate to Checkout for Contact Request ---
  const handleRequestContactInfo = useCallback(() => {
    if (!biodata?._id) return;
    navigate(`/checkout/${biodata._id}`);
  }, [biodata, navigate]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500" role="status" aria-live="polite">
        Loading biodata details...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-600 font-medium" role="alert">
        {error}
      </p>
    );
  }

  if (!biodata) {
    return (
      <p className="text-center mt-10 text-red-600 font-medium" role="alert">
        Biodata not found.
      </p>
    );
  }

  const isPremium = userInfo?.isPremium;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 capitalize">{biodata.name ?? 'Unnamed'}</h1>

      <section className="grid md:grid-cols-3 gap-6 items-start">
        {/* Profile Image */}
        <img
          src={biodata.photoURL || '/default-profile.png'}
          alt={biodata.name ?? 'Profile Image'}
          className="w-full h-auto rounded-lg object-cover"
          loading="lazy"
        />

        {/* Details Section */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
          <InfoRow label="Age" value={biodata.age} />
          <InfoRow label="Gender" value={biodata.gender} />
          <InfoRow label="Occupation" value={biodata.occupation} />
          <InfoRow label="Permanent Division" value={biodata.permanentDivision} />
          <InfoRow label="Present Division" value={biodata.presentDivision} />
          <InfoRow label="Height" value={biodata.height} />
          <InfoRow label="Weight" value={biodata.weight} />
          <InfoRow label="Blood Type" value={biodata.bloodType} />
          <InfoRow label="Hair Type" value={biodata.hairType} />
          <InfoRow label="Skin Tone" value={biodata.skinColor} />
          <InfoRow label="Father's Name" value={biodata.fatherName} />
          <InfoRow label="Mother's Name" value={biodata.motherName} />
          <InfoRow label="Expected Partner Age" value={biodata.expectedPartnerAge} />
          <InfoRow label="Expected Partner Height" value={biodata.expectedPartnerHeight} />
          <InfoRow label="Expected Partner Weight" value={biodata.expectedPartnerWeight} />

          {isPremium ? (
            <>
              <InfoRow label="Email" value={biodata.email} />
              <InfoRow label="Phone" value={biodata.phoneNumber} />
            </>
          ) : (
            <div
              className="col-span-2 text-red-600 font-semibold"
              role="note"
              aria-live="polite"
            >
              Only premium members can view contact information.
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="mt-8 flex gap-4 flex-wrap">
        <button
          type="button"
          onClick={handleAddToFavourites}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add to Favourites
        </button>

        {!isPremium && (
          <button
            type="button"
            onClick={handleRequestContactInfo}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Request Contact Information
          </button>
        )}
      </section>

      {/* Similar Biodatas */}
      {similarBiodatas.length > 0 && (
        <section className="mt-12" aria-label="Similar biodatas">
          <h2 className="text-2xl font-bold mb-4">Similar Biodatas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {similarBiodatas.map((bio) => (
              <BiodataCard
                key={bio._id}
                bio={bio}
                onClick={() => navigate(`/biodatas/${bio._id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default BiodataDetails;
