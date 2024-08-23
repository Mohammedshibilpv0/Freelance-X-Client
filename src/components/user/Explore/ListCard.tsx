import Card from '../Card/card';
import Store from '../../../store/store';
import { useEffect, useState } from 'react';
import { posts, gigs } from '../../../api/user/userServices';
import { useNavigate } from 'react-router-dom';
import Pagination from '../pagination/Pagination';

const ListCard = () => {
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
        const response = role === 'Client'
          ? await gigs(currentPage, limit)
          : await posts(currentPage, limit);

        setProjects(response.data);
        setCurrentPage(currentPage);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, currentPage]);



  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <div
                key={index}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          </div>
        </>
      )}
    </div>
  );
};

export default ListCard;
