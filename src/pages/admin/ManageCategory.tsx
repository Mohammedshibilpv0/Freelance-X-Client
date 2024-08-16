import { useState } from "react";
import SubCategoryTable from "../../components/admin/Subcategory/SubCategoryTable";
import CategoryTable from "../../components/admin/Category/categoryTable";

interface Category {
  _id: string;
  name: string;
  description: string;
}

const ManageCategory = () => {
  const [isCategoryView, setIsCategoryView] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleCategoryUpdate = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  return (
    <div className="container mx-auto px-20 mt-7">
      <div>
        <div className="flex items-center ms-28">
          <p
            className={`text-blue-400 cursor-pointer ${isCategoryView ? 'font-bold' : ''}`}
            onClick={() => setIsCategoryView(true)}
          >
            Category
          </p>
          <span className="mx-2">|</span>
          <p
            className={`text-blue-400 cursor-pointer ${!isCategoryView ? 'font-bold' : ''}`}
            onClick={() => setIsCategoryView(false)}
          >
            Subcategory
          </p>
        </div>
        <div className="mt-4">
          {isCategoryView ? (
            <CategoryTable onCategoryUpdate={handleCategoryUpdate} />
          ) : (
            <SubCategoryTable categories={categories} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageCategory;
