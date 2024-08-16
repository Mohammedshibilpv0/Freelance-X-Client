import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import { addSubCategory, fetchsubCategoryById, updateSubCategory } from "../../../api/admin/adminServices";
import useShowToast from "../../../Custom Hook/showToaster";

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface SubCategory {
  _id: string;
  name: string;
  description: string;
  category: string;
  edit?: boolean;
}

interface SubCategoryModalProp {
  toggleModal: () => void;
  title: string;
  SubcategoryId?: string | null;
  onCategoryUpdate: (category: SubCategory) => void;
  categories: Category[];
}

const SubCategoryModal: React.FC<SubCategoryModalProp> = ({
  toggleModal,
  title,
  SubcategoryId,
  onCategoryUpdate,
  categories
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const Toster = useShowToast();

  useEffect(() => {
    if (SubcategoryId) {
      async function fetchSubCategoryData() {
        try {
          const response = await fetchsubCategoryById(SubcategoryId as string);
          setName(response.SubCategory.name);
          setDescription(response.SubCategory.description);
          if (response.SubCategory.category && response.SubCategory.category._id) {
            setCategory(response.SubCategory.category._id);
          } else {
            setCategory("");
          }
        } catch (error) {
          console.error("Error fetching subcategory data:", error);
          Toster("Failed to fetch subcategory data", "error", true);
        }
      }
      fetchSubCategoryData();
    }
  }, [SubcategoryId]);

const handleAddOrEditSubCategory = async (event: React.FormEvent) => {
  event.preventDefault();

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  if (!trimmedName || !category || !trimmedDescription) {
    Toster("All fields are required", "error", true);
    return;
  }

  if (trimmedName.length <= 1) {
    Toster("Name should be more than 4 letters", "error", true);
    return;
  }

  if (trimmedDescription.length <= 10) {
    Toster("Description should be more than 10 letters", "error", true);
    return;
  }

  // Check if any changes have been made
  if (
    SubcategoryId &&
    (trimmedName === name && trimmedDescription === description && category === category)
  ) {
    Toster("No changes detected", "warning", true);
    return;
  }

  setLoading(true);

  try {
    let response;
    let updatedSubCategory;
    if (SubcategoryId) {
      response = await updateSubCategory(SubcategoryId, trimmedName, trimmedDescription, category);
      updatedSubCategory = { _id: SubcategoryId, name: trimmedName, description: trimmedDescription, category, edit: true };
    } else {
      response = await addSubCategory(trimmedName, trimmedDescription, category);
      updatedSubCategory = response.subCategory;
      updatedSubCategory.edit = false;
    }

    if (response.error) {
      Toster(response.error, "error", true);
    } else if (response.message) {
      Toster(response.message, "success", true);
      if (updatedSubCategory && updatedSubCategory._id) {
        onCategoryUpdate(updatedSubCategory);
      }
      toggleModal();
    }
  } catch (error) {
    Toster("An unexpected error occurred", "error", true);
  } finally {
    setLoading(false);
  }
};
0

  const handleCloseModal = () => {
    setName("");
    setDescription("");
    setCategory("");
    toggleModal();
  };

  return (
    <>
      <Modal
        toggleModal={handleCloseModal}
        title={title}
        fields={[
          {
            label: "Subcategory Name",
            type: "text",
            name: "subcategoryName",
            value: name,
            onChange: (e) => setName(e.target.value),
          },
          {
            label: "Category",
            type: "select",
            name: "categoryName",
            value: category,
            onChange: (e) => setCategory(e.target.value),
            options: [
              { label: "Please select a category", value: "" },
              ...categories.map(cat => ({ label: cat.name, value: cat._id }))
            ]
          },
          {
            label: "Description",
            type: "text",
            name: "description",
            value: description,
            onChange: (e) => setDescription(e.target.value),
          },
        ]}
        onSubmit={handleAddOrEditSubCategory}
        loading={loading}
        
      />
    </>
  );
};

export default SubCategoryModal;
