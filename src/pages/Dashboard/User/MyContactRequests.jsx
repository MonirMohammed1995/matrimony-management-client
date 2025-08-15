import React, { useEffect, useState, useContext, useCallback } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthProvider";

const MyContactRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user contact requests
  const fetchRequests = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/contact-requests?userEmail=${encodeURIComponent(
          user.email
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch contact requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Delete handler
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the contact request permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/contact-requests/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Failed to delete contact request");

        Swal.fire("Deleted!", "Contact request has been deleted.", "success");
        // Refresh list
        fetchRequests();
      } catch (err) {
        Swal.fire("Error", err.message || "Something went wrong", "error");
      }
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500" role="status" aria-live="polite">
        Loading your contact requests...
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

  if (!requests.length) {
    return (
      <p className="text-center mt-10 text-gray-700 font-medium">
        No contact requests found.
      </p>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Contact Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Biodata ID</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Status</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Mobile No</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Email</th>
              <th className="px-4 py-2 text-center text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{req.name || "N/A"}</td>
                <td className="px-4 py-3">{req.biodataId || "N/A"}</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    req.status === "Approve" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {req.status || "Pending"}
                </td>
                <td className="px-4 py-3">{req.status === "Approve" ? req.mobile || "N/A" : "-"}</td>
                <td className="px-4 py-3">{req.status === "Approve" ? req.email || "N/A" : "-"}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(req._id)}
                    className="text-red-600 hover:text-red-800 font-semibold focus:outline-none"
                    aria-label={`Delete contact request for ${req.name}`}
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

export default MyContactRequests;
