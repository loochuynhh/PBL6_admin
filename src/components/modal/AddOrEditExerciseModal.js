import React, { useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Button,
} from '@chakra-ui/react';
import { LinkIcon } from '@chakra-ui/icons';

const AddOrEditExerciseModal = ({
    isOpen,
    onClose,
    isButtonAddClick,
    isButtonEditClick,
    newExercise,
    setNewExercise,
    currentExercise,
    setCurrentExercise,
    handleAddExercise,
    handleUpdateExercise,
}) => {
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleInputChange = (field, value) => {
        if (isButtonAddClick) {
            setNewExercise((prev) => ({ ...prev, [field]: value }));
        } else {
            setCurrentExercise((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name;
            handleInputChange(type === 'image' ? 'imagePath' : 'videoPath', fileName);
        }
    };

    const triggerFileInput = (ref) => {
        if (ref.current) {
            ref.current.click();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isButtonAddClick ? 'Add New Exercise' : 'Update Exercise'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb="4">
                        <FormLabel>Name</FormLabel>
                        <Input
                            value={isButtonAddClick ? newExercise.name : currentExercise.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Exercise Name"
                        />
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel>Description</FormLabel>
                        <Input
                            value={isButtonAddClick ? newExercise.description : currentExercise.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Exercise Description"
                        />
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel>Image Link</FormLabel>
                        <Input
                            value={isButtonAddClick ? newExercise.imagePath : currentExercise.imagePath}
                            placeholder="Image Link"
                            position="relative"
                        />
                        <LinkIcon
                            boxSize={5}
                            color="gray.500"
                            position="absolute"
                            bottom="2"
                            right="2"
                            cursor="pointer"
                            onClick={() => triggerFileInput(imageInputRef)}
                        />
                        <Input
                            type="file"
                            display="none"
                            ref={imageInputRef}
                            onChange={(e) => handleFileChange(e, 'image')}
                        />
                    </FormControl>
                    <FormControl mb="4">
                        <FormLabel>Video Link</FormLabel>
                        <Input
                            value={isButtonAddClick ? newExercise.videoPath : currentExercise.videoPath}
                            placeholder="Video Link"
                            position="relative"
                        />
                        <LinkIcon
                            boxSize={5}
                            color="gray.500"
                            position="absolute"
                            bottom="2"
                            right="2"
                            cursor="pointer"
                            onClick={() => triggerFileInput(videoInputRef)}
                        />
                        <Input
                            type="file"
                            display="none"
                            ref={videoInputRef}
                            onChange={(e) => handleFileChange(e, 'video')}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={isButtonAddClick ? handleAddExercise : handleUpdateExercise}>
                        {isButtonAddClick ? 'Add Exercise' : 'Update Exercise'}
                    </Button>
                    <Button onClick={onClose} ml={3}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddOrEditExerciseModal;