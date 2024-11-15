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
import AddOrEditExerciseModal from 'components/modal/AddOrEditExerciseModal';
import DeleteConfirmationModal from 'components/modal/DeleteConfirmationModal';

export default function ExerciseTable(props) {
  const {planId, onBack} = props
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(0) 
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoPath, setCurrentVideoPath] = useState('');
  const [dataSelectedRow, setDataSelectedRow] = useState({})
  const [currentExercise, setCurrentExercise] = useState({});
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [isButtonAddClick, setIsButtonAddClick] = useState(false);
  const [isButtonEditClick, setIsButtonEditClick] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    videoPath: '',
    imagePath: '',
    userId: 0
  });
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const accessToken = localStorage.getItem('accessToken'); 

  const handleEditExercise = (exercise_plan) => {
    setCurrentExercise(exercise_plan.exercise);
    setIsOpen(true)
    setIsButtonEditClick(true)
  };

  const handleDeleteExercise = (rowId) => {
    setIsModalDeleteOpen(true)
    setSelectedExerciseId(rowId)
  }

  const handleOpenVideoModal = (dataSelected) => {
    setDataSelectedRow(dataSelected)
    setCurrentVideoPath(dataSelected.exercise.videoPath)
    setIsVideoModalOpen(true)
  }

  const handleOpenModalAddWorkout = () => {
    setIsButtonAddClick(true);
    setIsOpen(true);
  };

  const handleCloseModalPlan = () => {
    setIsOpen(false);
    setIsButtonEditClick(false);
    setIsButtonAddClick(false);
    setNewExercise({ name: '', description: '', videoPath: '' });
  }

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/plans/${selectedExerciseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setData((prev) => prev.filter((exercise) => exercise.id !== selectedExerciseId));
      setIsSuccess(true);
      setNotificationMessage("The exercise has been deleted successfully.");
    } catch (error) {
      console.error('Error deleting workout:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error deleting the exercise.");
    } finally {
      setIsNotificationOpen(true);
      setIsOpen(false);
      setIsModalDeleteOpen(false)
    }
  };

  const handleUpdateExercise = async () => {
    try {
      const response = await axios.put(`/api/plans/${currentExercise.id}`, currentExercise, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setData((prev) => prev.map((exercise) => (exercise.id === currentExercise.id ? response.data : exercise)));
      setCurrentExercise({});
      setIsSuccess(true);
      setNotificationMessage("The workout has been updated successfully.");
    } catch (error) {
      console.error('Error updating workout:', error);
      setIsSuccess(false);
      setNotificationMessage("There was an error updating the plan.");
    } finally {
      setIsNotificationOpen(true);
      setIsOpen(false);
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: exercisePlanData }, { data: userData }] = await Promise.all([
          axios.get(`/api/exercise-plans?planId.equals=${planId}&page=0&size=20`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }),
          // axios.get(`/api/account`, {
          //   headers: {
          //     Authorization: `Bearer ${accessToken}`
          //   }
          // })
        ]) 
        setData(exercisePlanData.data);
        // setUserId(userData.id)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId]);

  const handleAddExercise = async () => {
    try {
      const [{ data: exercise }, { data: exercise_plan }, {data: userData}] = await Promise.all([
        axios.get('/api/plans/all', {
          headers: {
            Authorization: `Bearer ${accessToken}` 
          }
        }),
        // axios.get(`/api/plans?page=${currentPage}&size=${pageSize}`, { 
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`
        //   }
        // }),
        axios.get(`/api/account`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      ]);
    }
    catch (err) {
      console.log("Error adding exercise", err)
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
        onOpenAdd={handleOpenModalAddWorkout}
      />

      <AddOrEditExerciseModal
        isOpen={isOpen}
        onClose={handleCloseModalPlan}
        isButtonAddClick={isButtonAddClick}
        isButtonEditClick={isButtonEditClick}
        newExercise={newExercise}
        setNewExercise={setNewExercise}
        currentExercise={currentExercise}
        setCurrentExercise={setCurrentExercise}
        handleAddExercise={handleAddExercise}
        handleUpdateExercise={handleUpdateExercise}
      />

      <TableRender
        table={table} 
        onRowClick={null}
        borderColor={borderColor}
        hover={false}
      />

      <ShowVideoModal
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
