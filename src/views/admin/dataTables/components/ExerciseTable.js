import {
  Text,
  useColorModeValue,
  Button,
  Box,
  Flex,
  Spinner
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import React, { useEffect, useState } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import TableRender from 'components/tableRender/TableRender';
import TableHeader from 'components/tableRender/TableHeader';
import TableColumn from 'components/tableRender/TableColumn';
import ShowVideoModal from 'components/modal/ShowVideoModal';
import NotificationModal from 'components/modal/NotificationModal';
import DeleteConfirmationModal from 'components/modal/DeleteConfirmationModal';
import AddOrEditExercisePlanModal from 'components/modal/AddOrEditExercisePlanModal';
import Banner from 'components/menu/Banner';
import AddNewDayModal from 'components/modal/AddNewDayModal';
import axiosInstance from '../../../../axiosConfig';

export default function ExerciseTable(props) {
  const {type, plan, planId, onBack} = props
  const [exercisePlanId, setExercisePlanId] = useState(null);
  const [data, setData] = useState([]);
  const [datePlans, setDatePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoPath, setCurrentVideoPath] = useState('');
  const [dataSelectedRow, setDataSelectedRow] = useState({})
  const [currentExercisePlan, setCurrentExercisePlan] = useState({});
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedExercisePlanId, setSelectedExercisePlanId] = useState(null);
  const [isButtonAddClick, setIsButtonAddClick] = useState(false);
  const [isButtonEditClick, setIsButtonEditClick] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalAddNewDayOpen, setIsModalAddNewDayOpen] = useState(false);
  const [newDatePlan, setNewDatePlan] = useState({
    time: '',
    dateOrder: 0,
    planId: planId
  })
  const [newExercisePlan, setNewExercisePlan] = useState({
    setCount: null,
    repCount: null,
    resTime: null,
    sequence: null,
    exerciseId: 0,
    datePlanId: 0
  })
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const accessToken = localStorage.getItem('accessToken'); 

  const handleEditExercise = (exercise_plan) => {
    setCurrentExercisePlan(exercise_plan)
    setIsOpen(true)
    setIsButtonEditClick(true)
  };

  const handleDeleteExercise = (rowData) => {
    setIsModalDeleteOpen(true)
    setSelectedExercisePlanId(rowData.id)
  }

  const handleOpenVideoModal = (dataSelected) => {
    setDataSelectedRow(dataSelected)
    setCurrentVideoPath(dataSelected.exercise.publicVideoUrl)
    setIsVideoModalOpen(true)
  }

  const handleOpenModalAddExercise = (exercisePlanId) => {
    setExercisePlanId(exercisePlanId);
    setIsButtonAddClick(true);
    setIsOpen(true);
  };

  const handleCloseModalPlan = () => {
    setIsOpen(false);
    setIsButtonEditClick(false);
    setIsButtonAddClick(false);
    setNewExercisePlan({ 
      time: null,
      dateOrder: null,
      setCount: null,
      repCount: null,
      exerciseId: 0,
      planId: 0 
    })
  }

  
  const handleConfirmDelete = async () => {
    setLoadingAPI(true)
    try {
      await axiosInstance.delete(`/api/exercise-plans/${selectedExercisePlanId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setData((prev) => prev.filter((exercisePlan) => exercisePlan.id !== selectedExercisePlanId));
      setIsSuccess(true);
      setNotificationMessage("The exercise has been deleted successfully.");
    } 
    catch (error) {
      console.error('Error deleting exercise:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error deleting the exercise.");
    } 
    finally {
      setLoadingAPI(false);
      setIsNotificationOpen(true);
      setIsOpen(false);
      setIsModalDeleteOpen(false)
    }
  };

  const handleUpdateExercisePlan = async () => {
    setLoadingAPI(true);
    try {
      await axiosInstance.put(
        `/api/exercise-plans/${currentExercisePlan.id}`,
        currentExercisePlan,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
      })
      
      setData((prev) => prev.map((exercisePlan) => (exercisePlan.id === currentExercisePlan.id ? currentExercisePlan : exercisePlan)));
      setIsSuccess(true);
      setNotificationMessage("The exercise has been updated successfully.");
    } 
    catch (error) {
      console.error('Error updating exercise:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error updating the exercise.");
    } 
    finally {
      setLoadingAPI(false);
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  const handleOpenModalAddNewDay = () => {
    setIsModalAddNewDayOpen(true);
  }

  const handleAddDatePlan = async () => {
    setLoadingAPI(true)
    try {
      await axiosInstance.post('/api/date-plans', newDatePlan, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      await axiosInstance.put(`/api/plans/${planId}`, {...plan, totalDays: plan.totalDays + 1}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setIsSuccess(true);
      setNotificationMessage("The new day has been added successfully.");
    }
    catch (err) {
      console.log("Error adding new day", err)
      setIsSuccess(false);
      setNotificationMessage("There was an error adding the new day.");
    }
    finally {
      setLoadingAPI(false);
      setIsNotificationOpen(true);
      setIsModalAddNewDayOpen(false);
    }
  }

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: exerciseData }, { data: exercisePlanData }, { data: datePlanData }] = await Promise.all([
          axiosInstance.get(`/public/api/exercises/all?planId.equals=${planId}`),
          axiosInstance.get('/api/exercise-plans/all', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }),
          axiosInstance.get(`/api/date-plans/all?planId.equals=${planId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
        ])

        const listExerciseId = exerciseData.map(exercise => exercise.id)
        const listExercisePlan = exercisePlanData.filter(ex_p => listExerciseId.includes(ex_p.exerciseId))

        const exerciseMap = exerciseData.reduce((acc, exercise) => {
          acc[exercise.id] = exercise;
          return acc;
        }, {});

        const combinedData = listExercisePlan.map(ex_p => ({
          ...ex_p,
          exercise: exerciseMap[ex_p.exerciseId] || {}
        }))

        setData(combinedData);
        // setDatePlans(datePlanData);
        if (datePlanData && datePlanData.length > 0) {
          setDatePlans(datePlanData);
        } else {
          console.error("No date plans found.");
        }
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
      
    };

    fetchData();
  }, [planId, accessToken]);

  const handleAddExercisePlan = async () => {
    setLoadingAPI(true)
    try {
      const { data: addedExercisePlan} = await axiosInstance.post(
        '/api/exercise-plans', 
        {
          ...newExercisePlan,
          exerciseId: newExercisePlan.exerciseId,
          datePlanId: exercisePlanId
        }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const { data: exerciseData } = await axiosInstance.get(`/public/api/exercises/${addedExercisePlan.exerciseId}`)

      const combinedData = {
        ...addedExercisePlan,
        exercise: exerciseData
      }

      setData((prev) => [ ...prev, combinedData])
      setIsSuccess(true)
      setNotificationMessage('The exercise plan has been added successfully.')
    } 
    catch (err) {
      console.log("Error adding exercise plan", err);
      setIsSuccess(false);
      setNotificationMessage("There was an error adding the exercise plan.");
    } 
    finally {
      setLoadingAPI(false)
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  const findExercisePlanId = (day) => {
    // return datePlans.filter(item => item.dateOrder === parseInt(day.split(' ')[1], 10))[0].id
    if (!datePlans || datePlans.length === 0) {
      return null; 
    }
  
    const dayData = datePlans.filter(item => item.dateOrder === parseInt(day.split(' ')[1], 10))[0];
    return dayData ? dayData.id : null;
  }

  const dayMap = {};
  datePlans.forEach(item => {
    const dayKey = `Day ${item.dateOrder}`;
    dayMap[dayKey] = [];
  });

  // data.forEach(item => {
  //   const dayKey = `Day ${item.datePlan.dateOrder}`;
  //   if (dayMap[dayKey]) {
  //     dayMap[dayKey].push(item);
  //   }
  // });

  data.forEach(item => {
    if (item.datePlan && item.datePlan.dateOrder) {
      const dayKey = `Day ${item.datePlan.dateOrder}`;
      if (dayMap[dayKey]) {
        dayMap[dayKey].push(item);
      }
    }
  });  

  const renderedDays = Object.entries(dayMap)
  .map(([day, exercises]) => ({ day, exercises }))
  .sort((a, b) => {
    const dayA = parseInt(a.day.split(' ')[1], 10);
    const dayB = parseInt(b.day.split(' ')[1], 10);
    return dayA - dayB;
  });

  const columns = type === 'plan' 
    ? TableColumn('exercise', textColor, handleEditExercise, handleDeleteExercise, handleOpenVideoModal) 
    : TableColumn('approveExercise', textColor, handleEditExercise, handleDeleteExercise, handleOpenVideoModal);
  
  if (loading) return <Spinner color="blue.500" />;

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      {/* <Button w='6.5rem' onClick={onBack} leftIcon={<ArrowBackIcon boxSize="15px" />}>
        Back
      </Button> */}

      {type === 'plan'
        ? <TableHeader title="Exercise" onOpenAdd={handleOpenModalAddNewDay}/>
        : <TableHeader title="Exercise"/>
      }
      
      <AddOrEditExercisePlanModal
        isOpen={isOpen}
        onClose={handleCloseModalPlan}
        isButtonAddClick={isButtonAddClick}
        isButtonEditClick={isButtonEditClick}
        newExercisePlan={newExercisePlan}
        setNewExercisePlan={setNewExercisePlan}
        currentExercisePlan={currentExercisePlan}
        setCurrentExercisePlan={setCurrentExercisePlan}
        handleAddExercisePlan={handleAddExercisePlan}
        handleUpdateExercisePlan={handleUpdateExercisePlan}
        loading={loadingAPI}
      />
      
      {renderedDays.map(({ day, exercises }) => (
        <Box key={day} paddingX={'20px'}>
          <Flex align='center'>
            <Text m='0' fontSize="lg" fontWeight="bold">{day}</Text>
            {type === 'plan' &&
              <Banner
                type="Exercise Table"
                onOpenAdd={() => handleOpenModalAddExercise(findExercisePlanId(day))}
              />
            }
          </Flex>
          <TableRender
            data={exercises}
            columns={columns}
            onRowClick={null}
            borderColor={borderColor}
            hover={false}
          />
        </Box>
      ))}
      
      <ShowVideoModal
        type='exercise plan'
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        currentVideoPath={currentVideoPath}
        dataSelectedRow={dataSelectedRow}
      />

      <AddNewDayModal
        isOpen={isModalAddNewDayOpen}
        onClose={() => setIsModalAddNewDayOpen(false)}
        newDatePlan={newDatePlan}
        setNewDatePlan={setNewDatePlan}
        handleAddDatePlan={handleAddDatePlan}
        loading={loadingAPI}
      />

      <DeleteConfirmationModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        handleConfirmDelete={handleConfirmDelete}
        object='Exercise'
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
