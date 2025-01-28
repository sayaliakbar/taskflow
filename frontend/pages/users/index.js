import { useEffect, useState } from "react";
// import axios from "../api/axios";
import Link from "next/link";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p>Email: {user.email}</p>
              <Link href={`/users/${user.id}`}>
                <a className="text-blue-500 hover:underline">View Profile</a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
