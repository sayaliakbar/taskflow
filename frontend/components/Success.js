//eslint-disable-next-line
const Success = ({ message, onDismiss }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] ">
      <div className=" p-6 rounded-lg shadow-lg max-w-md text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 mx-auto text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>

        <p className="text-gray-700">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="black_btn w-full mt-4 cursor-pointer"
          >
            Back to Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Success;
