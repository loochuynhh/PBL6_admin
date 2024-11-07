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
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import BannerExercise from 'components/menu/BannerExercise';
import * as React from 'react';
import axios from 'axios';

const columnHelper = createColumnHelper();

export default function ExerciseTable() {
  const [data, setData] = React.useState([]); 
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false); // State for modal
  const [newExercise, setNewExercise] = React.useState({
    name: '',
    description: '',
    videoPath: ''
  });
  const toast = useToast(); // Toast for notifications
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

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
    columnHelper.accessor('description', {
      id: 'description',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          DESCRIPTION
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('videoPath', {
      id: 'videoPath',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          VIDEO
        </Text>
      ),
      cell: (info) => (
        <Box>
          <Text color={textColor} fontSize="sm" fontWeight="700">
            <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
              View Video
            </a>
          </Text>
        </Box>
      ),
    }),
  ];

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/public/api/exercises/all'); 
        setData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const accessToken = localStorage.getItem('accessToken'); 
  const handleAddExercise = async () => {
    const options = {
      method: 'POST',
      url: 'http://localhost:8080/api/exercises',
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
      data: {
        name: newExercise.name,
        description: newExercise.description,
        videoPath: newExercise.videoPath,
      },
    };
  
    try {
      const response = await axios.request(options);
      setData((prev) => [...prev, response.data]);
      setNewExercise({ name: '', description: '', videoPath: '' }); // Resetting the form
      toast({
        title: "Exercise added.",
        description: "New exercise has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsOpen(false); 
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({
        title: "Error.",
        description: "There was an error adding the exercise.",
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
    return <Text>Loading...</Text>; // Display loading message while data is being fetched
  }

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Exercise Table
        </Text>
        <BannerExercise onOpenAddExercise={() => setIsOpen(true)} />
      </Flex>

      {/* Modal for adding new exercise */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Exercise</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4">
              <FormLabel>Name</FormLabel>
              <Input 
                value={newExercise.name} 
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })} 
                placeholder="Exercise Name" 
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Description</FormLabel>
              <Input 
                value={newExercise.description} 
                onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })} 
                placeholder="Exercise Description" 
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Video Link</FormLabel>
              <Input 
                value={newExercise.videoPath} 
                onChange={(e) => setNewExercise({ ...newExercise, videoPath: e.target.value })} 
                placeholder="Video Link" 
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddExercise}>
              Add Exercise
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
                      { {
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
