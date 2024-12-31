import {
  Box,
  Image
} from "@chakra-ui/react";

export default function UserReports() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Image
        src={require("assets/img/dashboards/background.jpg")}
        w="100%"
        borderRadius='30px'
      />
    </Box>
  );
}
