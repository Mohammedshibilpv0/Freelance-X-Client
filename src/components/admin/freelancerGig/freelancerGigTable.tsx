import { useEffect, useState } from 'react';
import Table from '../Table/Table';
import Pagination from '../../user/pagination/Pagination';
import { getFreelancerGigs, updateBlockStatusFreelancer } from '../../../api/admin/adminServices'; 
import EmptyData from '../../user/empty/Empty';

interface UserPost {
  _id: string; 
  projectName: string;
  category: string;
  subcategory: string;
  price: number;
  isblock: boolean;
}

const FreelancerGigTable = () => {
  const [data, setData] = useState<UserPost[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [noData,setNoData]=useState<boolean>(false)
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFreelancerGigs(currentPage, limit); 

        if(response.error){
         return setNoData(true)
        }
        setData(response.freelancerWork); 
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching freelancer gigs:', error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleBlockUnblock = async (index: number) => {
    const newData = [...data]; 
    const post = newData[index]; 

    try {
      await updateBlockStatusFreelancer(post._id, !post.isblock); 

      newData[index].isblock = !post.isblock;
      setData(newData); 
    } catch (error) {
      console.error('Error updating block status:', error);
    }
  };

  const columns = [
    {
      header: 'Project Name',
      accessor: (item: UserPost) => item.projectName,
    },
    {
      header: 'Category',
      accessor: (item: UserPost) => item.category,
    },
    {
      header: 'Subcategory',
      accessor: (item: UserPost) => item.subcategory,
    },
    {
      header: 'Price',
      accessor: (item: UserPost) => `$${item.price}`,
    },
    {
      header: 'Status',
      accessor: (item: UserPost) => (item.isblock ? 'Blocked' : 'Unblocked'),
    },
    {
      header: 'Action',
      accessor: (item: UserPost) => {
        const index = data.indexOf(item);
        return (
          <button
            className={`px-4 py-2 rounded ${
              item.isblock ? 'bg-red-500' : 'bg-green-500'
            } text-white`}
            onClick={() => handleBlockUnblock(index)}
          >
            {item.isblock ? 'Unblock' : 'Block'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto px-20 mt-7">
      <h1 className="text-2xl font-semibold mb-4">Freelancer Gigs</h1>
      <Table<UserPost> data={data} columns={columns} />
      {noData&&
        <div className='flex justify-center mt-7'>
          <EmptyData/>
        </div>
        }
      {!noData &&(
        <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
      )
      }
      </div>
  );
};

export default FreelancerGigTable;
