import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import axiosInstance from "../../../axiosConfig";

function SignIn() {
  const navigate = useNavigate();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        username: email,
        password: password,
      });
      
      localStorage.setItem("accessToken", response.data.accessToken); 
      navigate("/admin"); 
    } catch (error) {
      if (error.response) {
        console.error("Đăng nhập không thành công:", error.response.data.message || error.response.data.error || error.response.status);
        alert(`Đăng nhập không thành công: ${error.response.data.message || error.response.data.error || 'Lỗi không xác định'}`);
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
        alert("Không nhận được phản hồi từ server. Vui lòng thử lại sau.");
      } else {
        console.error("Đã xảy ra lỗi:", error.message);
        alert(`Đã xảy ra lỗi: ${error.message}`);
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your username and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <FormControl as="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Username<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              type='text'
              placeholder='Admin'
              mb='24px'
              fontWeight='500'
              size='lg'
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <NavLink to='/auth/forgot-password'>
                <Text
                  color="brand.500"
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'>
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              type="submit"
            > 
              {loading ? <>Please wait <Spinner size="sm" color="white" ml="1rem" /></> : 'Sign In'}
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
