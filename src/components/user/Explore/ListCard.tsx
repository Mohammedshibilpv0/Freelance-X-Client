import Card from '../Card/card';
import Store from '../../../store/store';
import { useEffect, useState } from 'react';
import { posts, gigs } from '../../../api/user/userServices';
import { useNavigate } from 'react-router-dom';
import Pagination from '../pagination/Pagination';
import EmptyData from '../empty/Empty';
import Loading from '../../../style/loading';

interface Filter {
  category?: string|undefined;
  subcategory?: string|undefined;
  searchTerm?: string|undefined;
  sortBy?: string|undefined;
  sortOrder?: 'asc' | 'desc'|undefined;
}

interface prop{
  filters:Filter|any
  loading:boolean
}

const ListCard:React.FC<prop> = ({ filters }) => { 
  const role = Store((config) => config.user.role);
  const [projects, setProjects] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const limit = 9; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const activeFilters = { ...filters };
        if (!activeFilters.category) delete activeFilters.category;
        if (!activeFilters.subcategory) delete activeFilters.subcategory;
    
        const response = role === 'Client'
          ? await gigs(currentPage, limit, activeFilters)
          : await posts(currentPage, limit, activeFilters);
    
        setProjects(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [role, currentPage, filters]); 

  return (
    <div className='md:ml-80 p-6 h-[78vh]'>
    {loading ? (
      <div className="flex justify-center items-center w-full h-full">
        <Loading/>
      </div>
    ) : projects.length === 0 ? (
      <div className="flex justify-center items-center w-full h-full">
        <EmptyData />
      </div>
    ) : (
      <>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/projectdetail/${project._id}/?${role.toLocaleLowerCase()}=true`)}
              className="cursor-pointer mx-auto"
            >
              <Card
                imageSrc={project.images[0]}
                title={project.projectName}
                
              />
            </div>
          ))}
        </div>
        <div className='flex justify-end mt-7 me-5'>
          {projects.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </>
    )}
  </div>
  )  
};

export default ListCard;
