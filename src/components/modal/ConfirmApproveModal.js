import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Spinner } from '@chakra-ui/react';

const ConfirmApproveModal = ({ isOpen, approve, onClose, handleConfirmApproveOrNot, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm {approve ? 'approve': 'reject'} plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure wanna {approve ? 'approve': 'reject'} this plan?
        </ModalBody>
        <ModalFooter pr=".5rem">
          <Button colorScheme="red" onClick={handleConfirmApproveOrNot}>
            {loading ? <Spinner color='white' /> : approve ? 'Yes, approve': 'Yes, reject'}
          </Button>
          <Button variant="ghost" border="1px solid #333" ml='.5rem' onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmApproveModal;