import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

const AdminSidebar = () => (
  <aside className="w-64 bg-gray-100 p-4 border-r min-h-screen">
    <h2 className="text-xl font-bold mb-6 text-center text-indigo-600">Admin Panel</h2>
    <ul className="space-y-4 text-base">
      <li><Link to="/dashboard/overview">Dashboard Overview</Link></li>
      <li><Link to="/dashboard/manage-users">Manage Users</Link></li>
      <li><Link to="/dashboard/approved-premium">Approved Premium</Link></li>
      <li><Link to="/dashboard/approved-contacts">Approved Contact Request</Link></li>
      <li><button className="text-red-500 flex items-center gap-1"><LogOut size={18} /> Logout</button></li>
    </ul>
  </aside>
);

export default AdminSidebar;
