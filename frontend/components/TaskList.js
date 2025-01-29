import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  fetchTasks,
  deleteTaskById,
  updateTaskStatus,
  taskUpdated,
  taskDeleted,
} from "@redux/tasksSlice";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [activeCategory, setActiveCategory] = useState("To-Do");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc");

  const tasksPerPage = 5;

  useEffect(() => {
    dispatch(fetchTasks());

    socket.on("taskUpdated", (updatedTask) => {
      dispatch(
        taskUpdated({ taskId: updatedTask._id, status: updatedTask.status })
      );
    });

    socket.on("taskDeleted", (deletedTaskId) => {
      dispatch(taskDeleted(deletedTaskId));
    });

    return () => {
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [dispatch]);

  const filteredTasks = tasks
    .filter((task) => task.status === activeCategory)
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const compareA = a[sortBy];
      const compareB = b[sortBy];
      if (sortOrder === "asc") return compareA > compareB ? 1 : -1;
      return compareA < compareB ? 1 : -1;
    });

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1)
      setCurrentPage(currentPage - 1);
    if (
      direction === "next" &&
      currentPage < Math.ceil(filteredTasks.length / tasksPerPage)
    )
      setCurrentPage(currentPage + 1);
  };

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ taskId, status: newStatus }));
    socket.emit("updateTaskStatus", { taskId, status: newStatus });
  };

  return (
    <>
      <h1 className="head_text orange_gradient  text-center">Task Flow</h1>
      <div className="mb-3 text-gray-600 text-sm leading-relaxed text-center ">
        <p className="desc">
          Task Flow is a collaborative task management system designed to help
          teams stay organized and on track. With real-time updates, intuitive
          navigation, and customizable workflows, Task Flow makes project
          management a seamless experience.
        </p>
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search_input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="search_input"
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="search_input"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          {["To-Do", "In Progress", "Done"].map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
              className={`outline_btn ${
                activeCategory === category
                  ? "orange_gradient hover:text-black"
                  : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {status === "loading" && <p className="desc">Loading tasks...</p>}
      {status === "failed" && <p className="desc text-red-500">{error}</p>}
      {status === "succeeded" && (
        <div className="mt-6">
          {paginatedTasks.length > 0 ? (
            <ul className="space-y-4 flex flex-col w-[720px] items-center ">
              {paginatedTasks.map((task) => (
                <li key={task._id} className="prompt_card">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-500">
                      Created by: {task.createdBy.name} on{" "}
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-end space-x-2 mt-4 ">
                    {user?.role === "admin" || user?.role === "editor" ? (
                      <>
                        {task.status !== "In Progress" && (
                          <button
                            onClick={() =>
                              handleStatusChange(task._id, "In Progress")
                            }
                            className="bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800"
                          >
                            Move to In Progress
                          </button>
                        )}
                        {task.status !== "Done" &&
                          task.status === "In Progress" && (
                            <button
                              onClick={() =>
                                handleStatusChange(task._id, "Done")
                              }
                              className="bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800"
                            >
                              Mark as Done
                            </button>
                          )}
                        {task.status !== "To-Do" && (
                          <button
                            onClick={() =>
                              handleStatusChange(task._id, "To-Do")
                            }
                            className=" border border-solid border-black text-black px-2 py-1 rounded-md hover:bg-gray-200"
                          >
                            Back to To-Do
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500">View Only</p>
                    )}
                    {user?.role === "admin" && (
                      <button
                        onClick={() => {
                          dispatch(deleteTaskById(task._id));
                          socket.emit("deleteTask", task._id);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="desc">No tasks in this category</p>
          )}
          {Math.ceil(filteredTasks.length / tasksPerPage) !== 0 && (
            <div className="flex-between mt-4">
              <button
                onClick={() => handlePageChange("prev")}
                className="outline_btn"
              >
                Previous
              </button>
              <p>
                Page {currentPage} of{" "}
                {Math.ceil(filteredTasks.length / tasksPerPage)}
              </p>
              <button
                onClick={() => handlePageChange("next")}
                className="outline_btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TaskList;
