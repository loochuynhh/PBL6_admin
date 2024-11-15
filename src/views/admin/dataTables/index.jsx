// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import WorkoutTable from "views/admin/dataTables/components/WorkoutTable";
import ExerciseTable from "views/admin/dataTables/components/ExerciseTable";
import React, { useState } from "react";

export default function Settings() {
  const [showTable, setShowTable] = useState(true)
  const [selectedPlanId, setSelectedPlanId] = useState(null)

  const handleRowClick = (planId) => {
    setShowTable(false)
    setSelectedPlanId(planId)
  }

  const handleBack = () => {
    setShowTable(true)
  }
  
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        {showTable ? (
          <WorkoutTable onRowClick={handleRowClick}/>
        ) : (
          <ExerciseTable planId={selectedPlanId} onBack={handleBack}/>
        )}
      </SimpleGrid>
    </Box>
  );
}
