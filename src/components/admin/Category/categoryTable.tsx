import { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import CategoryModal from './CategoryModal';
import { fetchCategory, deleteCategory } from '../../../api/admin/adminServices';
import Table from '../Table/Table';
import useShowToast from '../../../Custom Hook/showToaster';

interface Category {
   edit?:boolean
  _id: string;
  name: string;
  description: string;
}

interface CategoryTableProps {
  onCategoryUpdate: (categories: Category[]) => void;
}

const CategoryTable = ({ onCategoryUpdate }: CategoryTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditCategory, setIsEditCategory] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const Toast = useShowToast();

  const fetchCategories = async () => {
    const response = await fetchCategory();
    setCategories(response.categories);
    onCategoryUpdate(response.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setCategoryId(null);
    setIsEditCategory(false);
    setIsModalOpen(true);
  };

  const openEditModal = (categoryId: string) => {
    setCategoryId(categoryId);
    setIsEditCategory(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await deleteCategory(categoryId);
      if (response.message) {
        Toast(response.message, 'success', true);
        const updatedCategories = categories.filter((category) => category._id !== categoryId);
        setCategories(updatedCategories);
        onCategoryUpdate(updatedCategories); 
      }
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCategoryUpdate = (updatedCategory: Category) => {

    
    if (updatedCategory.edit) {
      const updatedCategories = categories.map(category => 
        category._id === updatedCategory._id ? updatedCategory : category
      );
      setCategories(updatedCategories);
      onCategoryUpdate(updatedCategories);
  
    } else{


      const newCategories = [updatedCategory, ...categories];
      setCategories(newCategories);
      onCategoryUpdate(newCategories);
    }
    closeModal();
  };

  const columns = [
    {
      header: 'Name',
      accessor: (category: Category) => `${category.name}`,
    },
    {
      header: 'Description',
      accessor: (category: Category) => `${category.description}`,
    },
    {
      header: 'Action',
      accessor: (category: Category) => (
        <div className='flex justify-end me-56'>
          <p className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => openEditModal(category._id)}>Edit</p>
          <p className="ms-9 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => handleDelete(category._id)}>Delete</p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-20 mt-7">
      <div className="flex mt-12 justify-end">
        <Button colorScheme="green" onClick={openAddModal}>Add Category</Button>
      </div>
      <div className="px-1 mt-3">
        <Table<Category>
          data={categories}
          columns={columns}
        />
      </div>
      {isModalOpen && (
        <CategoryModal
          title={isEditCategory ? 'Edit Category' : 'Add Category'}
          toggleModal={closeModal}
          categoryId={categoryId}
          onCategoryUpdate={handleCategoryUpdate}
        />
      )}
    </div>
  );
};

export default CategoryTable;
