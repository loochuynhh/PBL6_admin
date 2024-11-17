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
  const [currentExercisePlan, setCurrentExercisePlan] = useState({});
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedExercisePlanId, setSelectedExercisePlanId] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [isButtonAddClick, setIsButtonAddClick] = useState(false);
  const [isButtonEditClick, setIsButtonEditClick] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: null,
    description: null,
    videoPath: null,
    imagePath: null,
    userId: 0
  });
  const [newExercisePlan, setNewExercisePlan] = useState({
    time: null,
    dateOrder: null,
    setCount: null,
    repCount: null,
    exerciseId: 0,
    planId: 0
  })
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const accessToken = localStorage.getItem('accessToken'); 

  const handleEditExercise = (exercise_plan) => {
    setCurrentExercisePlan(exercise_plan)
    setCurrentExercise(exercise_plan.exercise);
    setIsOpen(true)
    setIsButtonEditClick(true)
  };

  const handleDeleteExercise = (rowData) => {
    setIsModalDeleteOpen(true)
    setSelectedExercisePlanId(rowData.id)
    setSelectedExerciseId(rowData.exerciseId)
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
    setNewExercise({ 
      name: null, 
      description: null, 
      videoPath: null, 
      imagePath: null, 
      userId: 0 
    });
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
      await axios.delete(`/api/exercises/${selectedExerciseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
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

  const handleUpdateExercise = async () => {
    try {
      const [{ data: updatedExercise }, { data: updatedExercisePlan }, { data: currentExerciseData }] = await Promise.all([
        axios.put(`/api/exercises/${currentExercise.id}`, currentExercise, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }),
        axios.put(`/api/exercise-plans/${currentExercisePlan.id}`, currentExercisePlan, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }),
        axios.get(`/public/api/exercises/${currentExercise.id}`)
      ])

      // console.log(currentExercise.imagePath)
      // console.log(currentExercise.videoPath)

      // const formDataImage = new FormData()
      // formDataImage.append('image', currentExercise.imagePath)
      // await axios.put(`/api/exercises/${currentExercise.id}/upload-image`, formDataImage, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
      
      // const formDataVideo = new FormData()
      // formDataVideo.append('video', currentExercise.videoPath)
      // await axios.put(`/api/exercises/${currentExercise.id}/upload-video`, formDataVideo, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })

      const combinedData = await { ...updatedExercisePlan, exercise: currentExerciseData}
      
      setData((prev) => prev.map((exercisePlan) => (exercisePlan.id === currentExercisePlan.id ? combinedData : exercisePlan)));
      setCurrentExercise({});
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
        const [{ data: exercisePlanData }, { data: userData }, { data: allExerciseData }] = await Promise.all([
          axios.get(`/api/exercise-plans?planId.equals=${planId}&page=0&size=20`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }),
          axios.get(`/api/account`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }),
          axios.get('/public/api/exercises/all')
        ])

        const exerciseMap = allExerciseData.reduce((acc, exercise) => {
          acc[exercise.id] = exercise;
          return acc;
        }, {});

        const combinedData = exercisePlanData.map(ex_p => ({
          ...ex_p,
          exercise: exerciseMap[ex_p.exerciseId] || {}
        }))

        setData(combinedData);
        setUserId(userData.id)
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
      const addExercise = await axios.post('/api/exercises', 
        { ...newExercise, imagePath: null, videoPath: null, userId: userId }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}` 
          }
        }
      );

      const formDataImage = new FormData()
      formDataImage.append('image', newExercise.imagePath)
      await axios.put(`/api/exercises/${addExercise.data.id}/upload-image`, formDataImage, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const formDataVideo = new FormData()
      formDataVideo.append('video', newExercise.videoPath)
      await axios.put(`/api/exercises/${addExercise.data.id}/upload-video`, formDataVideo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      const response = await axios.post('/api/exercise-plans', 
        { ...newExercisePlan, exerciseId: addExercise.data.id, planId: planId }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const exerciseData = await axios.get(`/public/api/exercises/${addExercise.data.id}`)

      const newDataEntry = {
        ...response.data,
        exercise: exerciseData.data
      };

      setData((prev) => [...prev, newDataEntry])
      setIsSuccess(true)
      setNotificationMessage('The exercise has been added successfully.')
    } 
    catch (err) {
      console.log("Error adding exercise", err);
      setIsSuccess(false);
      setNotificationMessage("There was an error adding the exercise.");
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
      
      <AddOrEditExerciseModal
        isOpen={isOpen}
        onClose={handleCloseModalPlan}
        isButtonAddClick={isButtonAddClick}
        isButtonEditClick={isButtonEditClick}
        newExercise={newExercise}
        setNewExercise={setNewExercise}
        currentExercise={currentExercise}
        setCurrentExercise={setCurrentExercise}
        newExercisePlan={newExercisePlan}
        setNewExercisePlan={setNewExercisePlan}
        currentExercisePlan={currentExercisePlan}
        setCurrentExercisePlan={setCurrentExercisePlan}
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
