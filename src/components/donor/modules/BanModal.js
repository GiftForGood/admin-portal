import React, { useState } from 'react';
import { Button, Stack, Textarea } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalHeader } from '@kiwicom/orbit-components/lib/Modal';

const BanModal = ({ title, description, onConfirm, onShow, onClose }) => {
  if (!onShow) {
    return null;
  }

  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const onClickConfirm = () => {
    if (reason.trim().length > 0) {
      setError('');
      onConfirm(reason);
      setReason('');
    } else {
      setError('A reason must be provided!');
    }
  };

  return (
    <Modal size="small">
      <ModalHeader title={title} />
      <ModalSection>
        <Textarea
          placeholder="Reason"
          label={description}
          value={reason}
          rows={6}
          spaceAfter="large"
          onChange={(e) => setReason(e.target.value)}
          resize="none"
          error={error}
        ></Textarea>
        <Stack direction="row">
          <Button type="secondary" fullWidth="100%" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth="100%" onClick={onClickConfirm}>
            Confirm
          </Button>
        </Stack>
      </ModalSection>
    </Modal>
  );
};

export default BanModal;
