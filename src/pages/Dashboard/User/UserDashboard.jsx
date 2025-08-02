import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { FaEdit, FaHeart, FaEye, FaUserFriends } from "react-icons/fa";

const UserSidebar = () => (
  <aside className="w-64 bg-gray-100 p-4 border-r min-h-screen">
    <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
    <nav className="space-y-3">
      <NavLink to="/dashboard/edit-biodata" className="block px-4 py-2 hover:bg-blue-100"> <FaEdit className="inline mr-2" /> Edit Biodata </NavLink>
      <NavLink to="/dashboard/view-biodata" className="block px-4 py-2 hover:bg-blue-100"> <FaEye className="inline mr-2" /> View Biodata </NavLink>
      <NavLink to="/dashboard/contact-requests" className="block px-4 py-2 hover:bg-blue-100"> <FaUserFriends className="inline mr-2" /> My Contact Request </NavLink>
      <NavLink to="/dashboard/my-favourites" className="block px-4 py-2 hover:bg-blue-100"> <FaHeart className="inline mr-2" /> Favourites Biodata </NavLink>
      <NavLink to="/logout" className="block px-4 py-2 text-red-500 hover:bg-red-100"><LogOut className="inline mr-2" /> Logout</NavLink>
    </nav>
  </aside>
);

export default UserSidebar;
