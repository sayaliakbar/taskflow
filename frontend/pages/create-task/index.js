import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../../redux/tasksSlice";
import Loading from "@components/Loading";
import LocalError from "@components/LocalError";
import GlobalError from "@components/GlobalError";
import Success from "@components/Success";

import Link from "next/link";

import { validateTaskTitle, validateTaskDescription } from "@utils/validation";

const CreateTask = () => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleAddTask = async (e) => {
    e.preventDefault();

    //Validate Task
    const titleError = validateTaskTitle(task);
    if (titleError) {
      setTitleError(titleError);
      return;
    }

    //Validate Description
    const descriptionError = validateTaskDescription(description);

    if (descriptionError) {
      setDescriptionError(descriptionError);
      return;
    }
    if (task.trim()) {
      setLoading(true);
      const response = await dispatch(
        createTask({ title: task, description: description })
      );
      if (response?.error) {
        setErrorMessage(response.payload);
        return;
      }

      if (response.meta.requestStatus === "fulfilled") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
        setLoading(false);
        setTask("");
        setDescription("");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (success) {
    return <Success message="Task added successfully!" />;
  }

  return (
    <div>
      <div className="glassmorphism flex flex-col items-center w-full max-w-sm p-8 space-y-6">
        <div>
          <div className="w-full space-y-4">
            <h1 className="sub_head_text blue_gradient text-center">
              Add New Task
            </h1>
            <p className="desc text-center">
              Enter your the title and description of your new task.
            </p>

            {/* Display global error message */}
            {errorMessage && (
              <GlobalError
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                onClear={() => setErrorMessage("")}
              />
            )}
            <form className="w-full space-y-4" onSubmit={handleAddTask}>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={task}
                onChange={(e) => {
                  setTask(e.target.value);
                  setTitleError("");
                }}
                className="form_input"
                placeholder="Enter task title"
                required
              />
              {titleError && (
                <LocalError errorDetail={titleError} id="title-error" />
              )}
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
              >
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDescriptionError("");
                }}
                className="form_input"
                placeholder="Enter task description"
                required
              />
              {descriptionError && (
                <LocalError
                  errorDetail={descriptionError}
                  id="description-error"
                />
              )}
              <button type="submit" className="w-full mt-4 black_btn">
                Add Task
              </button>
            </form>
          </div>
        </div>
        {/* Forgot password and register links */}
        <Link
          href="/"
          className="hover:text-gray-800 text-sm text-gray-500 text-center hover:underline"
        >
          Back to Tasks
        </Link>
      </div>
    </div>
  );
};

export default CreateTask;
