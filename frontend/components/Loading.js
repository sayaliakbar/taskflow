const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        {/* Loading text */}
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
