import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.config"; // adjust path if needed

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Admin Logout Error:", err);
    }
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-indigo-100 ${
      isActive ? "bg-indigo-200 text-indigo-700 font-semibold" : ""
    }`;

  return (
    <aside className="w-64 bg-gray-100 p-4 border-r min-h-screen">
      <h2 className="text-xl font-bold mb-6 text-center text-indigo-600">Admin Panel</h2>
      <ul className="space-y-2 text-base">
        <li>
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/admin/overview" className={linkClass}>
            Dashboard Overview
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/admin/manage-users" className={linkClass}>
            Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/admin/approved-premium" className={linkClass}>
            Approved Premium
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/admin/approved-contacts" className={linkClass}>
            Approved Contact Request
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/admin/piechart-analytics" className={linkClass}>
            Pie Chart
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/admin/success-stories" className={linkClass}>
            Success Stories
          </NavLink>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 flex items-center gap-1 rounded"
          >
            <LogOut size={18} /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;