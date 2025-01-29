/* eslint-disable react/prop-types */
const LocalError = ({ errorDetail }) => {
  return (
    <div className="text-red-500 mt-1 text-xs flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 inline-block mr-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-10a1 1 0 00-1 1v5a1 1 0 102 0V7a1 1 0 00-1-1zm0 1a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
      </svg>
      {errorDetail}
    </div>
  );
};

export default LocalError;
