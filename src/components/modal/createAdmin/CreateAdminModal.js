import React, { useState } from 'react';
import { Heading, Stack } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection } from '@kiwicom/orbit-components/lib/Modal';
import Tabs from './modules/Tabs';
import ExistingAccount from './modules/ExistingAccount';
import NewAccount from './modules/NewAccount';

const CreateAdminModal = ({ show, onHide, title, rerenderTable }) => {
  const [isNewAcc, setIsNewAcc] = useState(true);

  if (!show) {
    return <div></div>;
  }

  return (
    <Modal size="small">
      <ModalSection>
        <Stack spacing="condensed" spacing="comfy" spaceAfter="large">
          <Heading type="title2">{title}</Heading>
          <Tabs isNewAcc={isNewAcc} setIsNewAcc={setIsNewAcc} />
        </Stack>
        {isNewAcc ? (
          <NewAccount onHide={onHide} rerenderTable={rerenderTable} />
        ) : (
          <ExistingAccount onHide={onHide} rerenderTable={rerenderTable} />
        )}
      </ModalSection>
    </Modal>
  );
};

export default CreateAdminModal;
