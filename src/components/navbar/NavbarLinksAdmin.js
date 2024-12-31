// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
// Custom Components
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// Assets
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import axiosInstance from '../../axiosConfig';
export default function HeaderLinks(props) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const [username, setUsername] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountData = await axiosInstance.get('/api/account', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        setUsername(accountData.data.username)
      }
      catch (err) {
        console.log(err)
      }
    }
    
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    window.location.reload()
  }

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name="admin"
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {username}
            </Text>

            <Button
              variant="no-hover"
              bg="transparent"
              p="0px"
              minW="unset"
              minH="unset"
              h="18px"
              w="max-content"
              mx='.5rem'
              alignSelf='center'
              mb='.5rem'
              mr='2rem'
              border='1px solid #333'
              onClick={toggleColorMode}
            >
              <Icon
                me="10px"
                h="18px"
                w="18px"
                color={navbarIcon}
                as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
              />
            </Button>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={handleLogout}
              justifyContent='center'
              alignItems='center'
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};