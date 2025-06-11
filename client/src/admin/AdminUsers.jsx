import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, CalendarDays, Users, Search } from "lucide-react";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen px-10 py-10 bg-gradient-to-br from-[#0e0e2c] to-[#1f1f3a] text-white">
            <h2 className="text-4xl font-bold mb-8 text-indigo-400 flex gap-4 items-center"><Users className="h-10 w-10" /> User Directory</h2>
           
            <div className="relative w-full mb-8">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-indigo-400 w-5 h-5" />
                </span>
                <input
                    type="text"
                    placeholder="Search by email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#14142b] border border-indigo-600 text-white focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        className="p-6 bg-[#1a1a33] border border-indigo-600/30 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <User size={28} className="text-indigo-400" />
                            <div>
                                <p className="text-lg font-semibold text-white">User #{user.id}</p>
                                <p className="text-sm text-indigo-300">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-300 mt-2">
                            <CalendarDays size={18} />
                            <span>Joined: {new Date(user.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsers;
