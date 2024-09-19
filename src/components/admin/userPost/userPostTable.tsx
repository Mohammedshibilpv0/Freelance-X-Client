import { useEffect, useState } from 'react';
import Table from '../Table/Table';
import { getUserPosts, updateBlockStatus } from '../../../api/admin/adminServices';
import Pagination from '../../user/pagination/Pagination';
import { Empty } from 'antd';

interface UserPost {
  _id: string; 
  projectName: string;
  category:{
    name:string;  
  } 
  subcategory:{
    name:string;  
  } 
  startBudget: string;
  endBudget: string;
  status: string;
  isBlock: boolean;
}

const UserPostTable = () => {
  const [data, setData] = useState<UserPost[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [noData,setNoData]=useState<boolean>(false)
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserPosts(currentPage, limit);
        if(response.error){
          setNoData(true)
          return
        }
        setData(response.userPosts);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleBlockUnblock = async (index: number) => {
    const newData = [...data];
    const post = newData[index];
    const updatedBlockStatus = !post.isBlock;

    newData[index].isBlock = updatedBlockStatus;
    setData(newData);

    try {
      await updateBlockStatus(post._id, updatedBlockStatus);
    } catch (error) {
      console.error('Error updating block status:', error);
      
      // Revert local state if the API call fails
      newData[index].isBlock = !updatedBlockStatus;
      setData(newData);
    }
  };

  const columns = [
    {
      header: 'Project Name',
      accessor: (item: UserPost) => item.projectName,
    },
    {
      header: 'Category',
      accessor: (item: UserPost) => item.category.name,
    },
    {
      header: 'Subcategory',
      accessor: (item: UserPost) => item.subcategory.name,
    },
    {
      header: 'Start Budget',
      accessor: (item: UserPost) => `${item.startBudget}`,
    },
    {
      header: 'End Budget',
      accessor: (item: UserPost) => `${item.endBudget}`,
    },
    {
      header: 'Status',
      accessor: (item: UserPost) => item.isBlock ? 'Blocked' : 'Unblocked',
    },
    {
      header: 'Action',
      accessor: (item: UserPost) => {
        const index = data.indexOf(item);
        return (
          <button
            className={`px-4 py-2 rounded ${
              item.isBlock ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
            onClick={() => handleBlockUnblock(index)}
          >
            {item.isBlock ? 'Unblock' : 'Block'}
          </button>
        );
      },
    },
  ];

  

  return (
    <div className="container mx-auto px-20 mt-7">
      <h1 className="text-2xl font-semibold mb-4">User Posts</h1>
      <Table<UserPost> data={data} columns={columns} />
        {noData&&
        <div className='flex justify-center mt-7'>
          <Empty/>
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

export default UserPostTable;
