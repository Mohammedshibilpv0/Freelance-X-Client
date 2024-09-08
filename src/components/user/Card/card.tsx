import React, { useState } from 'react';
import { Box, Image, Stack, Heading, Skeleton } from '@chakra-ui/react';

interface CardProps {
  imageSrc: string;
  title: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, title }) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <Box 
      cursor='pointer'
      minW={'220px'}
      borderWidth='1px' 
      borderRadius='lg' 
      boxShadow='lg' 
      transition='transform 0.3s ease, box-shadow 0.3s ease'
      _hover={{ 
        boxShadow: 'xl', 
        transform: 'scale(1.05)' 
      }}
      m='2'
      opacity='0'
      animation='fadeIn 0.5s forwards'
    >
      {!imageLoaded && (
        <Skeleton height="200px" width='415px' borderTopRadius='lg' />
      )}
      
      <Image
        className='object-cover'
        src={imageSrc}
        alt={title}
        borderTopRadius='lg'
        objectFit='cover'
        onLoad={() => setImageLoaded(true)} 
        display={imageLoaded ? 'block' : 'none'} 
      />
      
      <Stack mt='4' spacing='4' p='4'>
        <Heading size='md' noOfLines={1}>{title}</Heading>
      </Stack>
    </Box>
  );
};

export default Card;
