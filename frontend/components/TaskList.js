import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchTasks, deleteTaskById } from "../redux/tasksSlice";

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);
  console.log(tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  if (tasks.length === 0) return <p>No tasks found</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      {status === "loading" && <p>Loading tasks...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      <ul>
        {tasks?.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center p-2 border rounded mb-2"
          >
            <p>{task.title}</p>
            <button
              onClick={() => dispatch(deleteTaskById(task._id))}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
