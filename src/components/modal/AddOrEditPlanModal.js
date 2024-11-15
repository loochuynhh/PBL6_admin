import React from 'react';
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
  Select,
  Button,
} from '@chakra-ui/react';

const AddOrEditPlanModal = ({ isOpen, onClose, isButtonAddClick, isButtonEditClick, newPlan, setNewPlan, currentPlan, setCurrentPlan, handleAddPlan, handleUpdatePlan }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isButtonAddClick ? 'Add New Plan' : (isButtonEditClick && 'Update Plan')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {['name', 'description', 'totalDays', 'rating', 'status'].map((field, index) => (
            <FormControl mb="4" key={index}>
              <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
              {field !== 'status' ? (
                <Input
                  type={field === 'totalDays' || field === 'rating' ? 'number' : 'text'}
                  value={isButtonAddClick ? newPlan[field] : (isButtonEditClick ? currentPlan[field] : '')}
                  onChange={(e) => {
                    const value = field === 'totalDays' || field === 'rating' ? Number(e.target.value) : e.target.value;
                    isButtonAddClick 
                      ? setNewPlan({ ...newPlan, [field]: value }) 
                      : isButtonEditClick && setCurrentPlan({ ...currentPlan, [field]: value });
                  }}
                  placeholder={field === 'totalDays' || field === 'rating' ? '0' : `Plan ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                />
              ) : (
                <Select
                  value={isButtonAddClick ? newPlan.status : (isButtonEditClick ? currentPlan.status : '')}
                  onChange={(e) => {
                    isButtonAddClick 
                      ? setNewPlan({ ...newPlan, status: e.target.value }) 
                      : isButtonEditClick && setCurrentPlan({ ...currentPlan, status: e.target.value });
                  }}
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                  <option value="PENDING">Pending</option>
                </Select>
              )}
            </FormControl>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={isButtonAddClick ? handleAddPlan : handleUpdatePlan}>
            {isButtonAddClick ? 'Add Plan' : 'Update Plan'}
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddOrEditPlanModal;