import { Text, Flex, IconButton, Box, Image } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const TableColumn = (type, textColor, handleEdit, handleDelete, handleOpenVideoModal) => {
  const columns = [];

  if (type === 'exercise') {
    columns.push(
      columnHelper.accessor('exercise.imagePath', {
        id: 'imagePath',
        header: () => (
          <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            IMAGE
          </Text>
        ),
        cell: (info) => (
          <Box>
            <Image h='50px' w='50px' src={info.getValue()} borderRadius='10%' me='13px' />
          </Box>
        ),
      })
    );
  }

  columns.push(
    columnHelper.accessor(type === 'plan' ? 'name' : 'exercise.name', {
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
    columnHelper.accessor(type === 'plan' ? 'description' : 'exercise.description', {
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
    })
  );

  if (type === 'plan') {
    columns.push(
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
      columnHelper.accessor('status', {
        id: 'status',
        header: () => (
          <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            STATUS
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      })
    );
  } else if (type === 'exercise') {
    columns.push(
      columnHelper.accessor('exercise.videoPath', {
        id: 'videoPath',
        header: () => (
          <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
            VIDEO
          </Text>
        ),
        cell: (info) => (
          <Box>
            <Text
              color={textColor}
              fontSize="sm"
              fontWeight="700"
              _hover={{ color: 'blue' }}
              cursor='pointer'
              onClick={() => handleOpenVideoModal(info.row.original)}
            >
              View Video
            </Text>
          </Box>
        ),
      })
    );
  }

  columns.push(
    columnHelper.display({
      id: 'delete',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          ACTION
        </Text>
      ),
      cell: (info) => (
        <Flex>
          <IconButton
            aria-label={`Edit ${type}`}
            icon={<EditIcon />}
            colorScheme="blue"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(info.row.original);
            }}
            mr={2}
          />
          <IconButton
            aria-label={`Delete ${type}`}
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(info.row.original.id);
            }}
          />
        </Flex>
      ),
    })
  );

  return columns;
};

export default TableColumn;