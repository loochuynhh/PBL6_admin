// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import WorkoutTable from "views/admin/dataTables/components/WorkoutTable";
import ExerciseTable from "views/admin/dataTables/components/ExerciseTable";
import React from "react";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <WorkoutTable/>
        <ExerciseTable/>
      </SimpleGrid>
    </Box>
  );
}
