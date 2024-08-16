import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { addCategory, fetchCategoryById, updateCategory } from "../../../api/admin/adminServices";
import useShowToast from "../../../Custom Hook/showToaster";

interface Category {
  _id: string;
  name: string;
  description: string;
  edit?:boolean
}

interface CategoryModalProp {
  toggleModal: () => void;
  title: string;
  categoryId?: string | null;
  onCategoryUpdate: (category: Category) => void;
}

const CategoryModal: React.FC<CategoryModalProp> = ({ toggleModal, title, categoryId, onCategoryUpdate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const Toster = useShowToast();

  useEffect(() => {
    if (categoryId) {
      async function fetchCategoryData() {
        const response = await fetchCategoryById(categoryId);
        setName(response.category.name);
        setDescription(response.category.description);
      }
      fetchCategoryData();
    }
  }, [categoryId]);

  const handleAddOrEditCategory = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      Toster("Both fields are required", "error", true);
      return;
    }

    if (trimmedName.length <= 4) {
      Toster("Name should be more than 4 letters", "error", true);
      return;
    }

    if (trimmedDescription.length <= 10) {
      Toster("Description should be more than 10 letters", "error", true);
      return;
    }

    setLoading(true);

    try {
      let response;
      let updatedCategory;
      if (categoryId) {
        response = await updateCategory(categoryId, trimmedName, trimmedDescription);
        updatedCategory = { _id: categoryId, name: trimmedName, description: trimmedDescription,edit:true };
      } else {
        response = await addCategory(trimmedName, trimmedDescription);
        updatedCategory =  response.category;     
        updatedCategory.edit=false  
      }
      
      if (response.error) {
        Toster(response.error, "error", true);
      } else if (response.message) {
        Toster(response.message, "success", true);
        if (updatedCategory && updatedCategory._id) {
          onCategoryUpdate(updatedCategory);
        }
        toggleModal();
      }
    } catch (error) {
      Toster("Category Already Exists ", "error", true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setName("");
    setDescription("");
    toggleModal();
  };

  return (
    <>
      <Modal
        toggleModal={handleCloseModal}
        title={title}
        fields={[
          {
            label: "Category Name",
            type: "text",
            name: "categoryName",
            value: name,
            onChange: (e) => setName(e.target.value),
          },
          {
            label: "Description",
            type: "text",
            name: "description",
            value: description,
            onChange: (e) => setDescription(e.target.value),
          },
        ]}
        onSubmit={handleAddOrEditCategory}
        loading={loading}
      />
    </>
  );
};

export default CategoryModal;
