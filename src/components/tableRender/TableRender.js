import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Flex } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table'; // Adjust the import based on your setup

const TableRender = ({ table, onRowClick, borderColor, hover }) => {
  return (
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
            <Tr
              key={row.id}
              {...(hover && {
                _hover: { bg: 'gray.200', transform: "scale(1.02)" },
                transition: "all 0.2s",
                cursor: 'pointer',
                onClick: () => onRowClick(row.original.id),
              })}
            >
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
  );
};

export default TableRender;