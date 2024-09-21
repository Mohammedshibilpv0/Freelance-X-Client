import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import {
  addCategory,
  fetchCategoryById,
  updateCategory,
} from "../../../api/admin/adminServices";
import useShowToast from "../../../Custom Hook/showToaster";

interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string; 
  edit?: boolean;
}

interface CategoryModalProp {
  toggleModal: () => void;
  title: string;
  categoryId?: string | null;
  onCategoryUpdate: (category: Category) => void;
}

const CategoryModal: React.FC<CategoryModalProp> = ({
  toggleModal,
  title,
  categoryId,
  onCategoryUpdate,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | undefined>(""); 
  const [imagePreview, setImagePreview] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);
  const Toster = useShowToast();

  useEffect(() => {
    if (categoryId) {
      async function fetchCategoryData() {
        const response = await fetchCategoryById(categoryId);
        setName(response.category.name);
        setDescription(response.category.description);

        if (response.category.image) {
          setExistingImage(response.category.image); 
          setImagePreview(null);
          setImage(null); 
        }
      }
      fetchCategoryData();
    }
  }, [categoryId]);

  useEffect(() => {
    if (image) {
      const previewUrl = URL.createObjectURL(image);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null); 
    }
  }, [image]);

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
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("description", trimmedDescription);
      if (image) {
        formData.append("image", image);
      }

      if (categoryId) {
        response = await updateCategory(categoryId, formData);
        updatedCategory = {
          _id: categoryId,
          name: trimmedName,
          description: trimmedDescription,
          image: image ? URL.createObjectURL(image) : existingImage,
          edit: true,
        };
      } else {
        response = await addCategory(formData);
        updatedCategory = response.category;
        updatedCategory.edit = false;
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

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setImage(files[0]);
      }
    } else {
      if (e.target.name === "categoryName") {
        setName(e.target.value);
      } else if (e.target.name === "description") {
        setDescription(e.target.value);
      }
    }
  };

  const handleCloseModal = () => {
    setName("");
    setDescription("");
    setImage(null);
    setExistingImage("");
    setImagePreview(null); 
    toggleModal();
  };

  return (
    <Modal
      toggleModal={handleCloseModal}
      title={title}
      fields={[
        {
          label: "Category Name",
          type: "text",
          name: "categoryName",
          value: name,
          onChange: handleFieldChange,
        },
        {
          label: "Description",
          type: "text",
          name: "description",
          value: description,
          onChange: handleFieldChange,
        },
        {
          label: "Image",
          type: "file",
          name: "image",
          onChange: handleFieldChange,
        },
      ]}
      onSubmit={handleAddOrEditCategory}
      loading={loading}
    >
      {(!image && existingImage) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium">Current Image:</h4>
          <img 
            src={existingImage} 
            alt="Current Category" 
            className="mt-2 h-32 w-32 object-cover rounded" 
          />
        </div>
      )}
      {imagePreview && (
        <div className="mt-4">
          <h4 className="text-sm font-medium">Selected Image Preview:</h4>
          <img 
            src={imagePreview} 
            alt="Selected Category" 
            className="mt-2 h-32 w-32 object-cover rounded" 
          />
        </div>
      )}
    </Modal>
  );
};

export default CategoryModal;
