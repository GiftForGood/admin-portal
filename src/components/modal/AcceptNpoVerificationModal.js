import React from 'react';
import { Button, Heading, Stack } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';

const AcceptNpoVerificationModal = ({ show, onHide, onClickAccept, title, description }) => {
  if (!show) {
    return <div></div>;
  }

  return (
    <Modal size="normal">
      <ModalSection>
        <Stack spacing="condensed" spaceAfter="normal">
          <Heading type="title2">{title}</Heading>
          <Heading type="title3">{description}</Heading>
        </Stack>
      </ModalSection>
      <ModalFooter>
        <Stack direction="row" justify="end" align="center">
          <Button type="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button onClick={onClickAccept}>Accept</Button>
        </Stack>
      </ModalFooter>
    </Modal>
  );
};

export default AcceptNpoVerificationModal;
