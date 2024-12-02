import { Box, Card, useColorModeValue } from "@chakra-ui/react";
import TableHeader from "components/tableRender/TableHeader";
import { useEffect, useState } from "react";
// import axios from "../../../configs/axios";
import axios from "axios";
import TableColumn from "components/tableRender/TableColumn";
import TableRender from "components/tableRender/TableRender";
import Pagination from "components/pagination/Paginantion";

const ApprovePlan = () => {
    const [data, setData] = useState([]);

    const [totalPendingPlans, setTotalPendingPlans] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const totalPages = Math.ceil(totalPendingPlans / pageSize);

    const accessToken = localStorage.getItem('accessToken');
    const textColor = useColorModeValue('secondaryGray.900', 'white');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: totalPendingPlan } = await axios.get(`/public/api/plans/all?id.lessThan=10`);
                const { data: PendingPlan } = await axios.get(`/public/api/plans?id.lessThan=10&page=${currentPage}&size=${pageSize}`)
                setTotalPendingPlans(totalPendingPlan.length)
                setData(PendingPlan)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [currentPage, accessToken])

    const handleInputPageChange = (event) => { 
        setTimeout(() => {
            const value = event.target.value;
            const pageNumber = Number(value) - 1;

            if (pageNumber >= 0 && pageNumber < totalPages) {
                setCurrentPage(pageNumber);
            } else if (value === "") {
                setCurrentPage(0);
            }
        }, 1500)
    };

    const handleEditPlan = (plan) => {
        console.log(plan)
    }

    const handleDeletePlan = (plan) => {
        
    }

    const columns = TableColumn('approve', textColor, handleEditPlan, handleDeletePlan);

    return ( 
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                <TableHeader title="Approve Plan"/>

                <TableRender
                    data={data}
                    columns={columns}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    handleInputPageChange={handleInputPageChange}
                />
            </Card>
        </Box>
    );
}
 
export default ApprovePlan;