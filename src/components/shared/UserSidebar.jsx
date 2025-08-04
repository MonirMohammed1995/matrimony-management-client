import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { FaEdit, FaHeart, FaEye, FaUserFriends, FaHome } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.config"; // ✅ use auth, not app

const UserSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);   // ✅ CORRECT: use auth, not app
      navigate("/");         // Redirect to Home page
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <aside className="w-64 bg-gray-100 p-4 border-r min-h-screen">
      <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
      <nav className="space-y-3">
        <NavLink to="/" className="block px-4 py-2 hover:bg-blue-100">
          <FaHome className="inline mr-2" /> Home
        </NavLink>
        <NavLink to="/dashboard/user/add-biodata" className="block px-4 py-2 hover:bg-blue-100">
          <FaEdit className="inline mr-2" /> Add Bio-Data
        </NavLink>
        <NavLink to="/dashboard/user/edit-biodata" className="block px-4 py-2 hover:bg-blue-100">
          <FaEdit className="inline mr-2" /> Edit Bio-Data
        </NavLink>
        <NavLink to="/dashboard/user/view-biodata" className="block px-4 py-2 hover:bg-blue-100">
          <FaEye className="inline mr-2" /> View Biodata
        </NavLink>
        <NavLink to="/dashboard/user/contact-requests" className="block px-4 py-2 hover:bg-blue-100">
          <FaUserFriends className="inline mr-2" /> My Contact Request
        </NavLink>
        <NavLink to="/dashboard/user/my-favourites" className="block px-4 py-2 hover:bg-blue-100">
          <FaHeart className="inline mr-2" /> Favourites Biodata
        </NavLink>
        <button
          onClick={handleLogout}
          className="block px-4 py-2 text-red-500 hover:bg-red-100 w-full text-left"
        >
          <LogOut className="inline mr-2" /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default UserSidebar;