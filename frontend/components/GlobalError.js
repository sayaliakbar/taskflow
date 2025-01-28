const ErrorMessage = ({ setErrorMessage, errorMessage, onClear }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 sm:px3 sm:py-2 px-4 py-3 rounded sm:text-sm text-[9px] flex justify-between items-center ">
      <div className="flex items-center gap-2">
        <span className="block sm:inline ">{errorMessage}</span>
      </div>
      <div
        className="cursor-pointer   "
        onClick={() => {
          onClear();
        }}
      >
        <svg
          className="fill-current h-6 w-6 text-red-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.95 5.05a.75.75 0 0 1 1.06 1.06L11.06 10l4.95 4.95a.75.75 0 1 1-1.06 1.06L10 11.06l-4.95 4.95a.75.75 0 0 1-1.06-1.06L8.94 10 4.99 5.05a.75.75 0 0 1 1.06-1.06L10 8.94l4.95-4.95z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ErrorMessage;
