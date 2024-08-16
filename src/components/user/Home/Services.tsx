import Cards from "../Card/card";
import { Flex, Box } from "@chakra-ui/react";

const Services = () => {
  return (
    <>
      <div className="flex justify-center items-center mt-11">
        <h1 className="font-medium text-2xl">Our Services</h1>
      </div>
      <div className="sm:mx-32  mt-6">
      
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
          <Cards
              imageSrc="https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"
              title="Programming"
            />
            <Cards
              imageSrc="https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"
              title="Graphic Design"
            />
            <Cards
              imageSrc="https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"
              title="Web Development"
            />
            <Cards
              imageSrc="https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"
              title="App Development"
            />
            <Cards
              imageSrc="https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"
              title="SEO Optimization"
            />
            <Cards
              imageSrc="https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"
              title="Digital Marketing"
            />
            <Cards
              imageSrc="https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"
              title="Data Analysis"
            />
            <Cards
              imageSrc="https://www.simplilearn.com/ice9/free_resources_article_thumb/Is_Graphic_Design_A_Good_Career.jpg"
              title="Content Writing"
            />
        </Flex>
      </Box>
      </div>
    </>
  );
};

export default Services;
