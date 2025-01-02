import {
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import axiosInstance from '../../../../axiosConfig';
import React, { useEffect, useState, useCallback } from 'react';
import Pagination from 'components/pagination/Paginantion';
import DeleteConfirmationModal from 'components/modal/DeleteConfirmationModal';
import AddOrEditPlanModal from 'components/modal/AddOrEditPlanModal';
import TableRender from 'components/tableRender/TableRender';
import TableHeader from 'components/tableRender/TableHeader';
import TableColumn from 'components/tableRender/TableColumn';
import NotificationModal from 'components/modal/NotificationModal';
import ConfirmApproveModal from 'components/modal/ConfirmApproveModal';

export default function WorkoutTable(props) {
  const { type, onRowClick } = props
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(0)
  const [loading, setLoading] = useState(true);
  const [loadingAPI, setLoadingAPI] = useState(false);
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
    totalDays: 0,
    rating: 0,
    status: 'PUBLIC',
    userId: 0
  });
  const [stateApproveModal, setStateApproveModal] = useState({
    isOpen: false,
    approve: false
  })

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const accessToken = localStorage.getItem('accessToken');
  const pageSize = 10;
  const totalPages = Math.ceil(totalPlans / pageSize);

  const getDataPublicPlan = useCallback(async () => {
    try {
      const [{ data: allPlans }, { data: paginatedPlans }, { data: userData }] = await Promise.all([
        axiosInstance.get('/public/api/plans/all?status.in=PUBLIC'),
        axiosInstance.get(`/public/api/plans?page=${currentPage}&size=${pageSize}`),
        axiosInstance.get(`/api/account`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      ]);

      setData(paginatedPlans);
      setUserId(userData.id);
      setTotalPlans(allPlans.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [currentPage, accessToken]);

  const getDataPendingPlan = useCallback(async () => {
    try {
      const { data: totalPendingPlan } = await axiosInstance.get(`/public/api/plans/all?status.equals=PENDING_REVIEW`);
      const { data: PendingPlan } = await axiosInstance.get(`/api/plans?status.equals=PENDING_REVIEW&page=${currentPage}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setTotalPlans(totalPendingPlan.length);
      setData(PendingPlan);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [currentPage, accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      type === 'plan' ? await getDataPublicPlan() : await getDataPendingPlan()
      setLoading(false);
    };

    fetchData();
  }, [type, currentPage, accessToken, getDataPublicPlan, getDataPendingPlan]);
  
  const handleAddPlan = async () => {
    setLoadingAPI(true)
    try {
      const response = await axiosInstance.post('/api/plans', { ...newPlan, userId: userId}, { 
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setData((prev) => [...prev, response.data]);
      setNewPlan({ ...newPlan, name: '', description: '' });
      setIsSuccess(true);
      setNotificationMessage('New plan has been added successfully');
    } catch (error) {
      console.error('Error adding plan:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error adding the plan.");
    } finally {
      setLoadingAPI(false);
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  const handleDeletePlan = (rowData) => {
    setIsModalDeleteOpen(true);
    setSelectedPlanId(rowData.id);
  };

  const handleConfirmDelete = async () => {
    setLoadingAPI(true)
    try {
      await axiosInstance.delete(`/api/plans/${selectedPlanId}`, {
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
      setLoadingAPI(false);
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
    setLoadingAPI(true)
    try {
      const response = await axiosInstance.put(`/api/plans/${currentPlan.id}`, currentPlan, {
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
      setLoadingAPI(false);
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  const handleOpenModalApprovePlanOrNot = (plan, state) => {
    setStateApproveModal({
      ...stateApproveModal,
      isOpen: true,
      approve: state
    })
    setCurrentPlan(plan)
  }

  const handleConfirmApproveOrNot = async () => {
    setLoadingAPI(true)
    try {
      await axiosInstance.put(`/api/plans/${currentPlan.id}`,
        {
          ...currentPlan,
          status: stateApproveModal.approve ? 'PUBLIC' : 'PRIVATE'
        }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      setData((prev) => prev.filter((plan) => plan.id !== currentPlan.id));
      setCurrentPlan({});
      setIsSuccess(true);
      setNotificationMessage(`The plan has been ${stateApproveModal.approve ? 'approved' : 'rejected'} successfully.`);
    }
    catch (error) {
      console.error(`Error ${stateApproveModal.approve ? 'approving' : 'rejecting'} plan:`, error);
      setIsSuccess(false);
      setNotificationMessage(`There was an error ${stateApproveModal.approve ? 'approving' : 'rejecting'} the plan.`);
    } finally {
      setLoadingAPI(false);
      setIsNotificationOpen(true);
      setStateApproveModal({
        ...stateApproveModal,
        isOpen: false
      })
    }
  }

  const handleOpenVideoModal = () => {
  }

  const columns = type === 'plan' 
    ? TableColumn('plan', textColor, handleEditPlan, handleDeletePlan) 
    : TableColumn('approve', textColor, handleEditPlan, handleDeletePlan, handleOpenVideoModal, handleOpenModalApprovePlanOrNot);
  
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
    setNewPlan({ ...newPlan, name: '', description: '' });
  };

  if (loading) return <Spinner color="blue.500" />;

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      {type === 'plan' 
        ? <TableHeader title="Plan Table" onOpenAdd={handleOpenModalAddPlan} />
        : <TableHeader title="Approve Plan" />
      }
      
      <TableRender
        type='plan'
        data={data}
        columns={columns}
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
        loading={loadingAPI}
      />

      <DeleteConfirmationModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        handleConfirmDelete={handleConfirmDelete}
        object='Plan'
        loading={loadingAPI}
      />

      <ConfirmApproveModal
        { ...stateApproveModal}
        onClose={() => setStateApproveModal(false)}
        handleConfirmApproveOrNot={handleConfirmApproveOrNot}
        loading={loadingAPI}
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