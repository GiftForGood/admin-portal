import React from 'react';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalHeader } from '@kiwicom/orbit-components/lib/Modal';

const ConfirmationModal = ({ title, onConfirm, onShow, onClose }) => {
  if (!onShow) {
    return null;
  }

  return (
    <Modal size="small">
      <ModalHeader title={title} description="Are you sure?" />
      <ModalSection>
        <Stack direction="row">
          <Button type="secondary" fullWidth="100%" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth="100%" onClick={onConfirm}>
            Confirm
          </Button>
        </Stack>
      </ModalSection>
    </Modal>
  );
};

export default ConfirmationModal;
