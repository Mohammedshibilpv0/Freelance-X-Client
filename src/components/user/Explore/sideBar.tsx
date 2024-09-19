import React, { useEffect, useState } from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined, MenuOutlined } from '@ant-design/icons';
import { fetchCategory, fetchSubcategories } from '../../../api/user/userServices';
import { debounce } from 'lodash';

const { Option } = Select;

interface Category {
    _id: string;
    name: string;
}

interface Subcategory {
    _id: string;
    name: string;
}
interface SideBarProps {
    updateFilters: (filters: any) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  }

const SideBar: React.FC<SideBarProps> = ({ updateFilters,setLoading }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [sortBy, setSortBy] = useState<string>('name');
    const [category, setCategory] = useState<Category[] | undefined>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[] | undefined>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetchCategory();
                setCategory(response.categories || []);
            } catch (error) {
                setCategory([]);
            }
        }
        fetchCategories();
    }, []);

    const handleCategoryChange = async (value: string) => {
        setSelectedCategory(value);
        setSelectedSubcategory(undefined); 
        updateFilters({ category: value, subcategory: undefined });

        if (value) {
            try {
                const response = await fetchSubcategories(value);
                setSubcategories(response.subcategories || []); 
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
            }
        } else {
            setSubcategories([]);
        }
    };

    const handleSubcategoryChange = (value: string) => {
        setSelectedSubcategory(value);
        updateFilters({ subcategory: value });
    };

    const debouncedSearch = debounce((value: string) => {
        updateFilters({ searchTerm: value });
        setLoading(false)
    }, 1000);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleSortByChange = (value: string) => {
        setSortBy(value);
        updateFilters({ sortBy: value });
    };

    const handleSortOrderChange = (value: string) => {
        setSortOrder(value);
        updateFilters({ sortOrder: value });
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory(undefined);
        setSelectedSubcategory(undefined);
        setSortBy('name');
        setSortOrder('asc');
        updateFilters({
            searchTerm: '',
            category: undefined,
            subcategory: undefined,
            sortBy: 'name',
            sortOrder: 'asc',
        });
        sessionStorage.removeItem('filters');
    };

    useEffect(() => {
        const savedFilters = sessionStorage.getItem('filters');
        if (savedFilters) {
            const filters = JSON.parse(savedFilters);
            setSearchTerm(filters.searchTerm || '');
            setSelectedCategory(filters.category);
            setSelectedSubcategory(filters.subcategory);
            setSortBy(filters.sortBy || 'name');
            setSortOrder(filters.sortOrder || 'asc');
            updateFilters(filters); 
        }
    }, []);

    useEffect(() => {
        const filters = {
            searchTerm,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            sortBy,
            sortOrder,
        };
        sessionStorage.setItem('filters', JSON.stringify(filters));
    }, [searchTerm, selectedCategory, selectedSubcategory, sortBy, sortOrder]);

    return (
        <>
            <div className={isSidebarVisible?'hidden':`md:hidden fixed top-0 left-0 right-0 mt-16 z-50 bg-slate-100 p-2 flex items-center gap-2`}>
                <Input
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-1"
                />
                <Button type="primary" icon={<MenuOutlined />} onClick={toggleSidebar}>
                    Filters
                </Button>
            </div>

            <div className="hidden md:block fixed mt-2 h-full w-80 bg-slate-50 shadow-md p-4">
                <h1 className="text-xl font-semibold mb-4">Sidebar</h1>

                <Input
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-4"
                />

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Sort By</h2>
                    <Select
                        defaultValue={sortBy}
                        onChange={handleSortByChange}
                        className="w-full mb-2"
                    >
                        <Option value="projectName">
                            <SortAscendingOutlined /> Project Name
                        </Option>
                        <Option value="price">
                            <SortAscendingOutlined /> Price
                        </Option>
                    </Select>
                    <Select
                        defaultValue={sortOrder}
                        onChange={handleSortOrderChange}
                        className="w-full"
                    >
                        <Option value="asc">
                            <SortAscendingOutlined /> Ascending
                        </Option>
                        <Option value="desc">
                            <SortDescendingOutlined /> Descending
                        </Option>
                    </Select>
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Category</h2>
                    <Select
                        placeholder="Select category"
                        onChange={handleCategoryChange}
                        value={selectedCategory}
                        className="w-full mb-2"
                    >
                        {category && category.length > 0 ? (
                            category.map(cat => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))
                        ) : (
                            <Option disabled>No categories available</Option>
                        )}
                    </Select>
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Subcategory</h2>
                    <Select
                        placeholder="Select subcategory"
                        onChange={handleSubcategoryChange}
                        value={selectedSubcategory}
                        className="w-full"
                        disabled={!subcategories || subcategories.length === 0}
                    >
                        {subcategories && subcategories.length > 0 ? (
                            subcategories.map(sub => (
                                <Option key={sub._id} value={sub._id}>
                                    {sub.name}
                                </Option>
                            ))
                        ) : (
                            <Option disabled>No subcategories available</Option>
                        )}
                    </Select>
                </div>

                <Button type="default" onClick={resetFilters}>
                    Reset Filters
                </Button>
            </div>

            {isSidebarVisible && (
                <>
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>
                    <div className="fixed top-0 left-0 bottom-0 w-80 bg-slate-50 shadow-md p-4 z-50 transition-transform transform translate-x-0">
                        <Button onClick={toggleSidebar} className="mb-4">Close</Button>

                       

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">Sort By</h2>
                            <Select
                                defaultValue={sortBy}
                                onChange={handleSortByChange}
                                className="w-full mb-2"
                            >
                                <Option value="projectName">
                                    <SortAscendingOutlined /> Project Name
                                </Option>
                                <Option value="price">
                                    <SortAscendingOutlined /> Price
                                </Option>
                            </Select>
                            <Select
                                defaultValue={sortOrder}
                                onChange={handleSortOrderChange}
                                className="w-full"
                            >
                                <Option value="asc">
                                    <SortAscendingOutlined /> Ascending
                                </Option>
                                <Option value="desc">
                                    <SortDescendingOutlined /> Descending
                                </Option>
                            </Select>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">Category</h2>
                            <Select
                                placeholder="Select category"
                                onChange={handleCategoryChange}
                                value={selectedCategory}
                                className="w-full mb-2"
                            >
                                {category && category.length > 0 ? (
                                    category.map(cat => (
                                        <Option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled>No categories available</Option>
                                )}
                            </Select>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">Subcategory</h2>
                            <Select
                                placeholder="Select subcategory"
                                onChange={handleSubcategoryChange}
                                value={selectedSubcategory}
                                className="w-full"
                                disabled={!subcategories || subcategories.length === 0}
                            >
                                {subcategories && subcategories.length > 0 ? (
                                    subcategories.map(sub => (
                                        <Option key={sub._id} value={sub._id}>
                                            {sub.name}
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled>No subcategories available</Option>
                                )}
                            </Select>
                        </div>

                        <Button type="default" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

export default SideBar;
