import {
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import axios from 'axios'; 
import React, { useEffect, useState } from 'react';
import Pagination from 'components/pagination/Paginantion';
import DeleteConfirmationModal from 'components/modal/DeleteConfirmationModal';
import AddOrEditPlanModal from 'components/modal/AddOrEditPlanModal';
import TableRender from 'components/tableRender/TableRender';
import TableHeader from 'components/tableRender/TableHeader';
import TableColumn from 'components/tableRender/TableColumn';
import NotificationModal from 'components/modal/NotificationModal';

export default function WorkoutTable({ onRowClick }) {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(0)
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPlans, setTotalPlans] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonAddClick, setIsButtonAddClick] = useState(false);
  const [isButtonEditClick, setIsButtonEditClick] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({});
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    totalDays: null,
    rating: null,
    status: 'PRIVATE',
    userId: 0
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const accessToken = localStorage.getItem('accessToken');
  const pageSize = 10;
  const totalPages = Math.ceil(totalPlans / pageSize);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: allPlans }, { data: paginatedPlans }, {data: userData}] = await Promise.all([
          axios.get('/api/plans/all', {
            headers: {
              Authorization: `Bearer ${accessToken}` 
            }
          }),
          axios.get(`/api/plans?page=${currentPage}&size=${pageSize}`, { 
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }),
          axios.get(`/api/account`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
        ]);

        setData(paginatedPlans);
        setUserId(userData.id)
        setTotalPlans(allPlans.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, accessToken]);
  
  const handleAddPlan = async () => {
    try {
      const response = await axios.post('/api/plans', { ...newPlan, userId: userId}, { 
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setData((prev) => [...prev, response.data]);
      setNewPlan({ name: '', description: '', totalDays: null, rating: null, status: 'PRIVATE' });
      setIsSuccess(true);
      setNotificationMessage('New plan has been added successfully');
    } catch (error) {
      console.error('Error adding plan:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error adding the plan.");
    } finally {
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  const handleDeletePlan = (rowData) => {
    setIsModalDeleteOpen(true);
    setSelectedPlanId(rowData.id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/plans/${selectedPlanId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setData((prev) => prev.filter((plan) => plan.id !== selectedPlanId));
      setIsSuccess(true)
      setNotificationMessage("Delete plan successfully.")
    }
    catch (error) {
      console.error('Error deleting plan:', error);
      setIsSuccess(false)
      setNotificationMessage("There was an error Deleting the plan.")
    }
    finally {
      setIsNotificationOpen(true);
      setIsOpen(false);
      setIsModalDeleteOpen(false)
    }
  };

  const handleEditPlan = (plan) => {
    setCurrentPlan(plan);
    setIsOpen(true);
    setIsButtonEditClick(true);
  };

  const handleUpdatePlan = async () => {
    try {
      const response = await axios.put(`/api/plans/${currentPlan.id}`, currentPlan, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setData((prev) => prev.map((plan) => (plan.id === currentPlan.id ? response.data : plan)));
      setCurrentPlan({});
      setIsSuccess(true);
      setNotificationMessage("The plan has been updated successfully.");
    } catch (error) {
      console.error('Error updating plan:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error updating the plan.");
    } finally {
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  const columns = TableColumn('plan', textColor, handleEditPlan, handleDeletePlan);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleInputPageChange = (event) => { 
    setTimeout(() => {
      const value = event.target.value;
      const pageNumber = Number(value) - 1;

      if (pageNumber >= 0 && pageNumber < totalPages) {
        setCurrentPage(pageNumber);
      } else if (value === "") {
        setCurrentPage(0);
      }
    }, 1500);
  };

  const handleOpenModalAddPlan = () => {
    setIsButtonAddClick(true);
    setIsOpen(true);
  };

  const handleCloseModalPlan = () => {
    setIsOpen(false);
    setIsButtonEditClick(false);
    setIsButtonAddClick(false);
    setNewPlan({ name: '', description: '', totalDays: null, rating: null, status: 'PRIVATE' });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <TableHeader title="Plan Table" onOpenAdd={handleOpenModalAddPlan} />
      
      <TableRender
        table={table}
        onRowClick={onRowClick}
        borderColor={borderColor}
        hover={true}
      />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        handleInputPageChange={handleInputPageChange}
      />

      <AddOrEditPlanModal
        isOpen={isOpen}
        onClose={handleCloseModalPlan}
        isButtonAddClick={isButtonAddClick}
        isButtonEditClick={isButtonEditClick}
        newPlan={newPlan}
        setNewPlan={setNewPlan}
        currentPlan={currentPlan}
        setCurrentPlan={setCurrentPlan}
        handleAddPlan={handleAddPlan}
        handleUpdatePlan={handleUpdatePlan}
      />

      <DeleteConfirmationModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        handleConfirmDelete={handleConfirmDelete}
        object='Plan'
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        message={notificationMessage}
        isSuccess={isSuccess}
      />
    </Card>
  );
}