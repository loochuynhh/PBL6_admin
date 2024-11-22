import {
  Text,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowBackIcon } from '@chakra-ui/icons';
import TableRender from 'components/tableRender/TableRender';
import TableHeader from 'components/tableRender/TableHeader';
import TableColumn from 'components/tableRender/TableColumn';
import ShowVideoModal from 'components/modal/ShowVideoModal';
import NotificationModal from 'components/modal/NotificationModal';
import DeleteConfirmationModal from 'components/modal/DeleteConfirmationModal';
import AddOrEditExercisePlanModal from 'components/modal/AddOrEditExercisePlanModal';

export default function ExerciseTable(props) {
  const {planId, onBack} = props
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
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
  const [newDatePlan, setNewDatePlan] = useState({
    time: null,
    dateOrder: null,
    planId: 0
  })
  const [newExercisePlan, setNewExercisePlan] = useState({
    setCount: null,
    repCount: null,
    resTime: null,
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

  const handleOpenModalAddExercise = () => {
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
    try {
      await axios.delete(`/api/exercise-plans/${selectedExercisePlanId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setData((prev) => prev.filter((exercisePlan) => exercisePlan.id !== selectedExercisePlanId));
      setIsSuccess(true);
      setNotificationMessage("The exercise has been deleted successfully.");
    } catch (error) {
      console.error('Error deleting exercise:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error deleting the exercise.");
    } finally {
      setIsNotificationOpen(true);
      setIsOpen(false);
      setIsModalDeleteOpen(false)
    }
  };

  const handleUpdateExercisePlan = async () => {
    try {
      await axios.put(
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
    } catch (error) {
      console.error('Error updating exercise:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error updating the exercise.");
    } finally {
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: exerciseData }, { data: exercisePlanData }] = await Promise.all([
          axios.get(`/public/api/exercises/all?planId.equals=${planId}`),
          axios.get('/api/exercise-plans/all', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }),
          axios.get(`/api/account`, {
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
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId]);

  const handleAddExercisePlan = async () => {
    try {
      const { data: addedDatePlan } = await axios.post(
        '/api/date-plans',
        {
          ...newDatePlan,
          planId: planId
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      const { data: addedExercisePlan} = await axios.post(
        '/api/exercise-plans', 
        {
          ...newExercisePlan,
          exerciseId: newExercisePlan.exerciseId,
          datePlanId: addedDatePlan.id
        }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const { data: exerciseData } = await axios.get(`/public/api/exercises/${addedExercisePlan.exerciseId}`)

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
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  const columns = TableColumn('exercise', textColor, handleEditExercise, handleDeleteExercise, handleOpenVideoModal);
  
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
    return <Text>Loading...</Text>;
  }

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Button w='6.5rem' onClick={onBack} leftIcon={<ArrowBackIcon boxSize="15px" />}>
        Back
      </Button>
      <TableHeader
        title="Exercise Table"
        onOpenAdd={handleOpenModalAddExercise}
      />
      
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
      />

      <TableRender
        table={table} 
        onRowClick={null}
        borderColor={borderColor}
        hover={false}
      />

      <ShowVideoModal
        type='exercise plan'
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        currentVideoPath={currentVideoPath}
        dataSelectedRow={dataSelectedRow}
      />

      <DeleteConfirmationModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        handleConfirmDelete={handleConfirmDelete}
        object='Exercise'
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
