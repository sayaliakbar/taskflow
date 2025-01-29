import authHOCs from "@hoc/withAuth";

const { onlyAdmin } = authHOCs;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserRole, deleteUser } from "../../redux/usersSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUpdateRole = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  return (
    <>
      <h1 className="head_text blue_gradient text-center">User Management</h1>
      {status === "loading" && <p className="desc">Loading users...</p>}
      {status === "failed" && <p className="desc text-red-500">{error}</p>}
      {status === "succeeded" && (
        <div className="mt-6">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Role</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{user.role}</td>
                  <td className="border border-gray-300 p-2 flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleUpdateRole(
                          user._id,
                          user.role === "admin" ? "viewer" : "admin"
                        )
                      }
                      className="black_btn"
                    >
                      {user.role === "admin"
                        ? "Demote to Viewer"
                        : "Promote to Admin"}
                    </button>
                    {user.role === "admin" && (
                      <button
                        onClick={() =>
                          handleUpdateRole(
                            user._id,
                            user.role === "editor" ? "viewer" : "editor"
                          )
                        }
                        className="outline_btn"
                      >
                        {user.role === "editor"
                          ? "Demote to Viewer"
                          : "Promote to Editor"}
                      </button>
                    )}
                    {user.role !== "admin" && (
                      <button
                        onClick={() =>
                          handleUpdateRole(
                            user._id,
                            user.role === "editor" ? "viewer" : "editor"
                          )
                        }
                        className="outline_btn"
                      >
                        {user.role === "editor"
                          ? "Demote to Viewer"
                          : "Promote to Editor"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="black_btn bg-red-500 hover:bg-red-600"
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default onlyAdmin(Users);
