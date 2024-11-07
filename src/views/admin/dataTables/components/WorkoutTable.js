import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import BannerWorkout from 'components/menu/BannerWorkout';
import * as React from 'react';
import axios from 'axios'; 
import { useState } from 'react';

const columnHelper = createColumnHelper();

export default function WorkoutTable() {
  const [data, setData] = React.useState([]); 
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState([]);
  const [isOpen, setIsOpen] = useState(false); // State for overlay
  const [newWorkout, setNewWorkout] = React.useState({
    name: '',
    description: '',
    totalDays: 0,
    rating: 0,
    status: 'PUBLIC'
  });
  const toast = useToast(); // Toast for notifications
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const accessToken = localStorage.getItem('accessToken'); 
  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          NAME
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('totalDays', {
      id: 'totalDays',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          TOTAL DAYS
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('rating', {
      id: 'rating',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          RATING
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()} ⭐
          </Text>
        </Flex>
      ),
    }),
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/plans/all', {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        }); 
        setData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddWorkout = async () => {
    const options = {
      method: 'POST',
      url: 'http://localhost:8080/api/plans',
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
      data: {
        name: newWorkout.name,
        description: newWorkout.description,
        status: newWorkout.status,
        totalDays: newWorkout.totalDays,
        rating: newWorkout.rating,
      },
    };
  
    try {
      const response = await axios.request(options);
      setData((prev) => [...prev, response.data]);
      setNewWorkout({ name: '', description: '', totalDays: 0, rating: 0, status: 'PUBLIC' });
      toast({
        title: "Workout added.",
        description: "New workout has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsOpen(false); 
    } catch (error) {
      console.error('Error adding workout:', error);
      toast({
        title: "Error.",
        description: "There was an error adding the workout.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Workout Table
        </Text>
        <BannerWorkout onOpenAddWorkout={() => setIsOpen(true)} />
      </Flex>

      {/* Modal for adding new workout */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4">
              <FormLabel>Name</FormLabel>
              <Input 
                value={newWorkout.name} 
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })} 
                placeholder="Workout Name" 
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Description</FormLabel>
              <Input 
                value={newWorkout.description} 
                onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })} 
                placeholder="Workout Description" 
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Total Days</FormLabel>
              <Input 
                type="number" 
                value={newWorkout.totalDays} 
                onChange={(e) => setNewWorkout({ ...newWorkout, totalDays: Number(e.target.value) })} 
                placeholder="Total Days" 
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Rating</FormLabel>
              <Input 
                type="number" 
                value={newWorkout.rating} 
                onChange={(e) => setNewWorkout({ ...newWorkout, rating: Number(e.target.value) })} 
                placeholder="Rating" 
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Status</FormLabel>
              <Select 
                value={newWorkout.status} 
                onChange={(e) => setNewWorkout({ ...newWorkout, status: e.target.value })} 
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddWorkout}>
              Add Workout
            </Button>
            <Button onClick={() => setIsOpen(false)} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '🔼',
                        desc: '🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}

          </Thead>
          <Tbody>
            {table.getRowModel().rows.slice(0, 25).map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} borderColor={borderColor}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
