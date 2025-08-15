import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthProvider";

const MyFavourites = () => {
  const { user } = useContext(AuthContext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favourites on mount
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/favourites?userEmail=${encodeURIComponent(
            user.email
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch favourites");
        const data = await res.json();
        setFavourites(data || []);
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to load favourites", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [user]);

  // Delete favourite handler
  const handleDelete = async (favId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this from your favourites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmed.isConfirmed) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/favourites/${favId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete favourite");

      // Remove deleted item from state
      setFavourites((prev) => prev.filter((fav) => fav._id !== favId));

      Swal.fire("Deleted!", "Favourite removed successfully.", "success");
    } catch (error) {
      Swal.fire("Error", error.message || "Could not delete favourite.", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600" role="status" aria-live="polite">
        Loading your favourites...
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-700 font-semibold">
        You have no favourites yet.
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">My Favourite Biodatas</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left border-b border-gray-300">Name</th>
              <th className="py-3 px-6 text-left border-b border-gray-300">Biodata ID</th>
              <th className="py-3 px-6 text-left border-b border-gray-300">Permanent Address</th>
              <th className="py-3 px-6 text-left border-b border-gray-300">Occupation</th>
              <th className="py-3 px-6 text-center border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {favourites.map((fav) => (
              <tr key={fav._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 whitespace-nowrap">{fav.name || "N/A"}</td>
                <td className="py-3 px-6 whitespace-nowrap">{fav.biodataId || "N/A"}</td>
                <td className="py-3 px-6 whitespace-nowrap">{fav.permanentDivision || "N/A"}</td>
                <td className="py-3 px-6 whitespace-nowrap">{fav.occupation || "N/A"}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(fav._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                    aria-label={`Delete favourite ${fav.name}`}
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default MyFavourites;
