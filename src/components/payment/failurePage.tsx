import { Link } from "react-router-dom";

const FailurePage = () => {
  return (
    <div
      className="bg-gray-100 h-screen flex items-center justify-center"
      style={{ height: "calc(100vh - 70px)" }}
    >
      <div className="bg-white p-6 md:mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="text-red-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 13.293a1 1 0 0 1-1.414 0L12 13.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L10.586 12 7.293 8.707a1 1 0 1 1 1.414-1.414L12 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414L13.414 12l3.293 3.293a1 1 0 0 1 0 1.414z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold">
            Payment Failure !
          </h3>
          <p className="text-gray-600 my-2">
            Payment not completed. something went wrong 
          </p>
          <p>Please try again later!</p>
          <div className="py-10 text-center">
            <Link
              to={'/profile'}
              className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
            >GO BACK</Link>
              
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailurePage;
