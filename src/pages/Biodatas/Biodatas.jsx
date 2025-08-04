import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const divisions = ['Dhaka', 'Chattogram', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];
const biodataTypes = ['Male', 'Female'];

const Biodatas = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    ageRange: [18, 60],
    biodataType: '',
    permanentDivision: '',
    presentDivision: '',
  });

  const [biodatas, setBiodatas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleAgeRangeChange = (index, value) => {
    const newRange = [...filters.ageRange];
    newRange[index] = Number(value);
    setFilters(prev => ({ ...prev, ageRange: newRange }));
  };

  const fetchBiodatas = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.biodataType) queryParams.append('gender', filters.biodataType.toLowerCase());
      if (filters.permanentDivision) queryParams.append('permanentDivision', filters.permanentDivision);
      if (filters.presentDivision) queryParams.append('presentDivision', filters.presentDivision);

      if (filters.ageRange.length === 2) {
        queryParams.append('minAge', filters.ageRange[0]);
        queryParams.append('maxAge', filters.ageRange[1]);
      }

      const url = `${import.meta.env.VITE_API_URL}/biodatas?${queryParams.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      setBiodatas(data || []);
    } catch (err) {
      console.error('Failed to fetch biodata', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiodatas();
  }, [filters]);

  const handleViewProfile = (biodataId) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/biodata/${biodataId}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 gap-6">
      {/* Filters */}
      <aside className="w-full md:w-72 bg-white shadow rounded-lg p-4 sticky top-20 self-start">
        <h2 className="text-xl font-semibold mb-4">Filter Options</h2>

        {/* Age */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Age Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              min={18}
              max={filters.ageRange[1]}
              value={filters.ageRange[0]}
              onChange={(e) => handleAgeRangeChange(0, e.target.value)}
              className="input input-bordered w-1/2"
            />
            <input
              type="number"
              min={filters.ageRange[0]}
              max={60}
              value={filters.ageRange[1]}
              onChange={(e) => handleAgeRangeChange(1, e.target.value)}
              className="input input-bordered w-1/2"
            />
          </div>
        </div>

        {/* Biodata Type */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Biodata Type</label>
          <select
            className="select select-bordered w-full"
            value={filters.biodataType}
            onChange={(e) => handleFilterChange('biodataType', e.target.value)}
          >
            <option value="">All</option>
            {biodataTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Permanent Division */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Permanent Division</label>
          <select
            className="select select-bordered w-full"
            value={filters.permanentDivision}
            onChange={(e) => handleFilterChange('permanentDivision', e.target.value)}
          >
            <option value="">All</option>
            {divisions.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        {/* Present Division */}
        <div>
          <label className="block font-medium mb-1">Present Division</label>
          <select
            className="select select-bordered w-full"
            value={filters.presentDivision}
            onChange={(e) => handleFilterChange('presentDivision', e.target.value)}
          >
            <option value="">All</option>
            {divisions.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Biodata Cards */}
      <section className="flex-1 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Biodata Listings</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : biodatas.length === 0 ? (
          <p className="text-center text-gray-500">No biodata found with current filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {biodatas.map((bio, idx) => (
              <div key={bio._id} className="border rounded-lg p-4 flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={bio.photoURL || '/default-profile.png'}
                    alt={`${bio.name} Profile`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Biodata Id: <span className="font-normal">{idx + 1}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Type: <span className="font-normal capitalize">{bio.gender}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Permanent Division: <span className="font-normal">{bio.permanentDivision}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Present Division: <span className="font-normal">{bio.presentDivision}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Age: <span className="font-normal">{bio.age}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Occupation: <span className="font-normal">{bio.occupation}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewProfile(bio._id)}
                  className="btn btn-primary mt-auto self-start"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Biodatas;
