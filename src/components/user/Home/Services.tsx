import { useEffect, useState } from "react";
import { fetchCategory } from "../../../api/user/userServices";
import Cards from "../Card/card";
import { Flex, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";



interface Category {
  _id: string;
  name: string;
  image?: string;
}

const Services = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchCategory();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCardClick = (categoryId: string) => {

    navigate(`/explore?categoryId=${categoryId}`);
  };

  return (
    <>
      <div className="flex justify-center items-center mt-11">
        <h1 className="font-medium text-2xl">Our Services</h1>
      </div>
      <div className="sm:mx-32 mt-6">
        <Box
          overflowX="auto"
          whiteSpace="nowrap"
          paddingStart="4"
          mb="20"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          <Flex
            direction="row"
            align="flex-start"
            justify="start"
            gap="5"
          >
            {categories.map((category) => (
              <div className="mb-10" key={category._id} onClick={() => handleCardClick(category._id)}>
                <Cards
                  imageSrc={category.image ?? "https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"}
                  title={category.name}
                />
              </div>
            ))}
          </Flex>
        </Box>
      </div>
    </>
  );
};

export default Services;
