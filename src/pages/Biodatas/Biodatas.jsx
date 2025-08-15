import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const divisions = ["Dhaka", "Chattogram", "Rangpur", "Barisal", "Khulna", "Mymensingh", "Sylhet"];
const biodataTypes = ["Male", "Female"];

const FilterGroup = ({ label, children }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const SelectField = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200"
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const BiodataCard = ({ bio, onViewProfile }) => (
  <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition duration-200 flex flex-col">
    <div className="flex items-center gap-4 mb-4">
      <img
        src={bio.photoURL || "/images/default-profile.png"}
        alt={`${bio.name || "User"} profile`}
        className="w-20 h-20 rounded-full object-cover border"
      />
      <div>
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Biodata ID:</span> #{bio.biodataId}
        </p>
        <p className="capitalize text-gray-800 font-medium">{bio.name}</p>
        <p className="text-sm text-gray-500">{bio.occupation}</p>
      </div>
    </div>

    <div className="text-sm text-gray-700 space-y-1 mb-4">
      <p><span className="font-semibold">Type:</span> {bio.biodataType}</p>
      <p><span className="font-semibold">Permanent:</span> {bio.permanentDivision}</p>
      <p><span className="font-semibold">Present:</span> {bio.presentDivision}</p>
      <p><span className="font-semibold">Age:</span> {bio.age}</p>
    </div>

    <button
      onClick={() => onViewProfile(bio._id)}
      className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
    >
      View Profile
    </button>
  </div>
);

const Biodatas = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    ageRange: [18, 60],
    biodataType: "",
    permanentDivision: "",
    presentDivision: "",
    sort: "asc",
  });

  const [biodatas, setBiodatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 9;

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleAgeRangeChange = (index, value) => {
    const num = Number(value);
    const newRange = [...filters.ageRange];
    newRange[index] = num;
    // Ensure min <= max
    if (newRange[0] <= newRange[1]) {
      setFilters((prev) => ({ ...prev, ageRange: newRange }));
    }
  };

  const fetchBiodatas = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.biodataType) queryParams.append("gender", filters.biodataType);
      if (filters.permanentDivision) queryParams.append("permanentDivision", filters.permanentDivision);
      if (filters.presentDivision) queryParams.append("presentDivision", filters.presentDivision);
      if (filters.ageRange.length === 2) {
        queryParams.append("minAge", filters.ageRange[0]);
        queryParams.append("maxAge", filters.ageRange[1]);
      }
      queryParams.append("page", page);
      queryParams.append("limit", limit);
      queryParams.append("sort", filters.sort);

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${API_URL}/biodatas?${queryParams.toString()}`);
      const data = await res.json();

      setBiodatas(data.biodatas || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch biodata", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiodatas();
  }, [filters, page]);

  const handleViewProfile = (id) => {
    if (!user) return navigate("/login");
    navigate(`/biodatas/${id}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters */}
      <aside className="md:col-span-1 bg-white rounded-xl shadow p-4 sticky top-24 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>

        <FilterGroup label="Age Range">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={18}
              max={filters.ageRange[1]}
              value={filters.ageRange[0]}
              onChange={(e) => handleAgeRangeChange(0, e.target.value)}
              className="w-1/2 border rounded px-2 py-1"
            />
            <input
              type="number"
              min={filters.ageRange[0]}
              max={60}
              value={filters.ageRange[1]}
              onChange={(e) => handleAgeRangeChange(1, e.target.value)}
              className="w-1/2 border rounded px-2 py-1"
            />
          </div>
        </FilterGroup>

        <FilterGroup label="Biodata Type">
          <SelectField
            value={filters.biodataType}
            onChange={(e) => handleFilterChange("biodataType", e.target.value)}
            options={biodataTypes}
            placeholder="Select type"
          />
        </FilterGroup>

        <FilterGroup label="Permanent Division">
          <SelectField
            value={filters.permanentDivision}
            onChange={(e) => handleFilterChange("permanentDivision", e.target.value)}
            options={divisions}
            placeholder="Select permanent division"
          />
        </FilterGroup>

        <FilterGroup label="Present Division">
          <SelectField
            value={filters.presentDivision}
            onChange={(e) => handleFilterChange("presentDivision", e.target.value)}
            options={divisions}
            placeholder="Select present division"
          />
        </FilterGroup>

        <FilterGroup label="Sort by Age">
          <SelectField
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            options={["asc", "desc"]}
            placeholder="Sort order"
          />
        </FilterGroup>
      </aside>

      {/* Biodata List */}
      <section className="md:col-span-3">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Biodata Listings</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading biodata...</p>
        ) : biodatas.length === 0 ? (
          <p className="text-center text-gray-500">No biodata found with current filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {biodatas.map((bio) => (
                <BiodataCard key={bio._id} bio={bio} onViewProfile={handleViewProfile} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to page ${i + 1}`}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Biodatas;
