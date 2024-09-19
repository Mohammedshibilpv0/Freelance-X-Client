import smallbgImage from '../../../assets/images/smallbg.png'
import bgImage from '../../../assets/images/5.webp'


const HomeBanner = () => {
  return (
    <div className='bg-slate-50 mt-'>
      <div className="relative  py-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between ">
        <div className="absolute inset-0 z-0 md:hidden">
          <img
            src={smallbgImage}
            alt="Example Small"
            className="w-full h-full object-cover mt-"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative md:w-1/2  md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white md:text-black">
            Find the Best Freelancers for Your Projects
          </h1>
          <p className="mb-8 text-white md:text-black">
            Solid is the ultimate platform to connect with top freelancers.
            Leverage our powerful tools to manage your projects and collaborate
            with experts worldwide.
          </p>
          {/* <form className="relative w-full flex items-center ">
            <input
              type="text"
              placeholder="Search Services"
              className="border border-gray-300 rounded h-10 px-4 py-2 focus:outline-none focus:ring-2 w-full sm:w-60   focus:ring-indigo-500 pr-20 md:w-6/12"
            />
            <button
              type="submit"
              className="right-0 top-0 h-10 bg-indigo-500 ms-3 text-white px-4 rounded hover:bg-indigo-600"
            >
              Get
            </button>
          </form> */}
        </div>

        <div className="hidden md:block md:w-1/2 mt-8 md:mt-0 justify-center md:justify-end">
          <img
            src={bgImage}
            alt="Example"
            className="w-3/4 sm:w-3/4 md:w-11/12 h-auto "
          />
        </div>
      </div>
      </div>
  );
};

export default HomeBanner;
