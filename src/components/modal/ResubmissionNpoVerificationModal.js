import React, { useState } from 'react';
import { Button, Heading, Stack, Textarea } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';

const ResubmissionNpoVerificationModal = ({ show, onHide, onClickRequest, title, description }) => {
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  if (!show) {
    return <div></div>;
  }
  const onClickSubmit = () => {
    if (reason.length > 0) {
      setError('');
      onClickRequest(reason)
      onHide();
    } else {
      setError('A reason must be provided!');
    }
  };

  return (
    <Modal size="normal">
      <ModalSection>
        <Stack spacing="condensed" spaceAfter="normal">
          <Heading type="title2">{title}</Heading>
          <Heading type="title3">{description}</Heading>
        </Stack>
        <Textarea
          value={reason}
          rows={6}
          spaceAfter="small"
          onChange={(e) => setReason(e.target.value)}
          resize="none"
          error={error}
        />
      </ModalSection>
      <ModalFooter>
        <Stack direction="row" justify="end" align="center">
          <Button type="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button onClick={onClickSubmit} type="secondary">Request resubmission</Button>
        </Stack>
      </ModalFooter>
    </Modal>
  );
};

export default ResubmissionNpoVerificationModal;
