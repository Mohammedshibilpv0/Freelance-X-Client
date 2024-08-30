import { Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SubCategoryModal from './SubCategoryModal';
import { getSubCategories,deleteSubCategory } from '../../../api/admin/adminServices';
import Table from '../Table/Table';
import useShowToast from '../../../Custom Hook/showToaster';
import Pagination from '../../user/pagination/Pagination';

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface Subcategory {
  edit?:boolean,
  _id: string;
  name: string;
  description: string;
  category: string | Category[];
}

interface SubCategoryTableProps {
  categories: Category[];
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({ categories }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditSubCategory, setIsEditSubCategory] = useState<boolean>(false);
  const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
  const [subcategoryId, setSubCategoryId] = useState<string | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(1); 
  const limit=7

  const openAddSubCategory = () => {
    setSubCategoryId(null);
    setIsEditSubCategory(false);
    setIsModalOpen(true);
  };

  const Toast=useShowToast()

  const fetchCategories = async () => {
    try {
      const response = await getSubCategories(currentPage, limit);
      
      if (response && Array.isArray(response.SubCategories)) {      
        console.log(response);
         
        setSubCategories(response.SubCategories);
        setTotalPages(response.totalPages);
      } else {
        setSubCategories([]); 
      }
      setCategoriesLoaded(true);
    } catch (error) {
      setSubCategories([]); 
      setCategoriesLoaded(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const closeModal = () => setIsModalOpen(false);
  
  const handleCategoryUpdate = (updatedCategory: Subcategory) => {
    if (updatedCategory.edit) {
      
      setSubCategories((prevCategories) => {
        const existingIndex = prevCategories.findIndex(category => category._id === updatedCategory._id);
        if (existingIndex >= 0) {
          const updatedCategories = [...prevCategories];
          updatedCategories[existingIndex] = updatedCategory;
          return updatedCategories;
        } else {
          return [updatedCategory, ...prevCategories];
        }
      });
    } else {
      setSubCategories((prevCategories) => [updatedCategory, ...prevCategories]);
    }
    closeModal();
  };

  const openEditModal = (categoryId: string) => {
    setSubCategoryId(categoryId);
    setIsEditSubCategory(true);
    setIsModalOpen(true);
  };

 const handleDelete = async (subcategoryId: string) => {
  try {
    const response = await deleteSubCategory(subcategoryId);
    if (response.message) {
      Toast(response.message, 'success', true);

      const updatedSubCategories = subCategories.filter(
        (subcategory) => subcategory._id !== subcategoryId
      );
      setSubCategories(updatedSubCategories);
    }
  } catch (err) {
    console.log(err);
    Toast('Failed to delete subcategory', 'error', true);
  }
};

  const columns = [
    {
      header: 'Name',
      accessor: (subcategory: Subcategory) => `${subcategory.name}`,
    },
    {
      header: 'Description',
      accessor: (subcategory: Subcategory) => `${subcategory.description}`,
    },
    {
      header: 'Category',
      accessor: (subcategory: Subcategory) => {
        const category = categories.find(cat => cat._id === subcategory.category);
        return category ? category.name : 'Unknown Category';
      },
    },
    {
      header: 'Action',
      accessor: (subcategory: Subcategory) => (
        <div className='flex justify-end'>
          <Button className='me-3' colorScheme="blue" onClick={() => openEditModal(subcategory._id)}>Edit</Button>
          <Button colorScheme="red" onClick={() => handleDelete(subcategory._id)}>Delete</Button>
        </div>
      )
    },
  ];

  return (
   <>
    <div className="container mx-auto px-20 mt-7">
      <div className="flex mt-12 justify-end">
        <Button colorScheme="green" onClick={openAddSubCategory}>Add Subcategory</Button>
      </div>
      <div className="px-1 mt-3">
        {categoriesLoaded ? (
          <Table<Subcategory>
            data={subCategories}
            columns={columns}
          />
        ) : (
          <p>Loading categories...</p>
        )}
      </div>

      {isModalOpen && (
        <SubCategoryModal 
          title={isEditSubCategory ? 'Edit Subcategory' : 'Add Subcategory'}
          toggleModal={closeModal}
          SubcategoryId={subcategoryId}
          onCategoryUpdate={handleCategoryUpdate}
          categories={categories}
        />
      )}
    </div>
    <div className='flex justify-end me-24 mt-3'>
      <Pagination  currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages}/>
    </div>
   </>
  );
}

export default SubCategoryTable;
