import React from "react";

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base-200 bg-opacity-70 backdrop-blur-sm">
      <button className="btn loading btn-primary mb-4">{message}</button>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export default PageLoader;
