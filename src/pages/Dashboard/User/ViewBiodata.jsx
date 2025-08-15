import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import Swal from "sweetalert2";

const ViewBiodata = () => {
  const { user } = useContext(AuthContext);
  const [biodata, setBiodata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestingPremium, setRequestingPremium] = useState(false);

  useEffect(() => {
    const fetchBiodata = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/biodatas/user/${encodeURIComponent(
            user?.email
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch biodata");
        const data = await res.json();

        if (!data?.biodata) {
          setError("No biodata found for your account.");
          setBiodata(null);
        } else {
          setBiodata(data.biodata);
        }
      } catch (err) {
        setError(err.message || "Something went wrong while fetching biodata.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchBiodata();
    }
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleMakePremium = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to request premium status for your biodata?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      setRequestingPremium(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/biodatas/request-premium/${biodata._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire(
            "Requested!",
            "Your biodata has been sent for premium approval.",
            "success"
          );
          // Update biodata state to reflect request pending
          setBiodata((prev) => ({ ...prev, premiumRequested: true }));
        } else {
          Swal.fire("Error", data.message || "Failed to request premium.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong.", "error");
      } finally {
        setRequestingPremium(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600" role="status" aria-live="polite">
        Loading your biodata...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold" role="alert">
        {error}
      </div>
    );
  }

  if (!biodata) {
    return (
      <div className="text-center mt-10 text-gray-700 font-semibold">
        No biodata available.
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-900">
          Your Biodata
        </h1>

        <div className="flex justify-center mb-8">
          <img
            src={biodata.photoURL || "/default-profile.png"}
            alt={`${biodata.name}'s Profile`}
            className="w-40 h-40 rounded-full object-cover border border-gray-300"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-lg">
          <p>
            <strong>Biodata Type:</strong> {biodata.biodataType || "N/A"}
          </p>
          <p>
            <strong>Name:</strong> {biodata.name || "N/A"}
          </p>
          <p>
            <strong>Date of Birth:</strong> {formatDate(biodata.dateOfBirth)}
          </p>
          <p>
            <strong>Age:</strong> {biodata.age || "N/A"}
          </p>
          <p>
            <strong>Height:</strong> {biodata.height || "N/A"}
          </p>
          <p>
            <strong>Weight:</strong> {biodata.weight || "N/A"}
          </p>
          <p>
            <strong>Occupation:</strong> {biodata.occupation || "N/A"}
          </p>
          <p>
            <strong>Race (Skin Color):</strong> {biodata.race || "N/A"}
          </p>
          <p>
            <strong>Father's Name:</strong> {biodata.fatherName || "N/A"}
          </p>
          <p>
            <strong>Mother's Name:</strong> {biodata.motherName || "N/A"}
          </p>
          <p>
            <strong>Permanent Division:</strong> {biodata.permanentDivision || "N/A"}
          </p>
          <p>
            <strong>Present Division:</strong> {biodata.presentDivision || "N/A"}
          </p>
          <p>
            <strong>Expected Partner Age:</strong> {biodata.expectedPartnerAge || "N/A"}
          </p>
          <p>
            <strong>Expected Partner Height:</strong> {biodata.expectedPartnerHeight || "N/A"}
          </p>
          <p>
            <strong>Expected Partner Weight:</strong> {biodata.expectedPartnerWeight || "N/A"}
          </p>
          <p>
            <strong>Contact Email:</strong> {biodata.email || "N/A"}
          </p>
          <p>
            <strong>Mobile Number:</strong> {biodata.phoneNumber || "N/A"}
          </p>
        </div>

        {!biodata.isPremium && !biodata.premiumRequested ? (
          <div className="text-center mt-10">
            <button
              disabled={requestingPremium}
              onClick={handleMakePremium}
              className={`bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                requestingPremium ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {requestingPremium ? "Requesting..." : "Make Biodata Premium"}
            </button>
          </div>
        ) : biodata.premiumRequested && !biodata.isPremium ? (
          <div className="text-center mt-10 text-yellow-600 font-semibold">
            Premium request is pending admin approval.
          </div>
        ) : (
          <div className="text-center mt-10 text-green-600 font-semibold">
            This biodata is already premium.
          </div>
        )}
      </div>
    </main>
  );
};

export default ViewBiodata;
