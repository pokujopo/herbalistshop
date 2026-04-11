function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative w-14 h-14">
        
        {/* background circle */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        
        {/* spinning */}
        <div className="absolute inset-0 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>

      </div>
    </div>
  );
}

export default PageLoader;