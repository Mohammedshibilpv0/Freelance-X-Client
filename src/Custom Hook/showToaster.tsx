import { useToast } from "@chakra-ui/react";

const useShowToast = () => {
  const toast = useToast();

  const showToast = (
    title: string,
    status: "info" | "warning" | "success" | "error",
    isClosable: boolean
  ) => {
    toast({
      title: title,
      status: status,
      isClosable: isClosable,
      position: "top-right",
      duration: 3000,
    });
  };

  return showToast;
};

export default useShowToast;
