import React, { useState, useEffect } from 'react';
import { Stack, Button, InputField } from '@kiwicom/orbit-components/';
import api from '@api';
import { DONOR_TYPES, ACTIONS } from '@constants/donor';
import ConfirmationModal from '../modules/ConfirmationModal';
import { getFormattedDateTime } from '@utils/time/time';
import styled from 'styled-components';

const DonorDetailsContainer = styled.div`
  margin-top: 100px;
  max-width: 1000px;
  margin: 0 auto;
`;

const DonorPage = ({ donorId }) => {
  const [donor, setDonor] = useState(null);
  const [showCorporateModal, setShowCorporateModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    api.donors.get(donorId).then((donor) => setDonor(donor));
  }, []);

  const makeCorporateDonor = () => {
    api.donors
      .makeCorporate(donorId)
      .then((updatedDonor) => {
        setDonor(updatedDonor);
        setShowCorporateModal(false);
      })
      .catch((err) => console.error(err));
  };

  const revokeCorporateDonor = () => {
    api.donors
      .revokeCorporate(donorId)
      .then((updatedDonor) => {
        setDonor(updatedDonor);
        setShowCorporateModal(false);
      })
      .catch((err) => console.error(err));
  };

  const banDonor = () => {
    // api.donors
    //   .ban(donorId)
    //   .then((updatedDonor) => {
    //     setDonor(updatedDonor);
    //     setShowBanModal(false);
    //   })
    //   .catch((err) => console.error(err));
  };

  const openCorporateModal = () => {
    setShowCorporateModal(true);
  };

  const openBanModal = () => {
    setShowBanModal(true);
  };

  if (!donor) return null;

  const donorData = donor.data();
  return (
    <DonorDetailsContainer>
      <Stack direction="row" justify="end">
        <Button onClick={openCorporateModal}>
          {donorData.isCorporatePartner ? 'Revoke Corporate' : 'Make Corporate'}
        </Button>
        <Button disabled={donorData.isBlocked} type="critical" onClick={openBanModal}>
          Ban
        </Button>
      </Stack>
      <Stack>
        <InputField readOnly label="Name" value={donorData.name} />
        <InputField readOnly label="Email" value={donorData.email} />
        <InputField readOnly label="Joined Date" value={getFormattedDateTime(donorData.joinedDateTime.toMillis())} />
        <InputField
          readOnly
          label="Last Logged-in Date"
          value={getFormattedDateTime(donorData.lastLoggedInDateTime.toMillis())}
        />
        <InputField
          readOnly
          label="Donor Type"
          value={donorData.isCorporatePartner ? DONOR_TYPES.CORPORATE : DONOR_TYPES.NORMAL}
        />
        {/* {donorData.isCorporatePartner && (
          <InputField readOnly label="Made Corporate By" value={donorData.actionsByAdmin.filter((action) => action.type === ACTIONS.MAKE_CORPORATE)[0].name} />
        )} */}
        {/* {donorData.isBlocked && <InputField readOnly label="Banned By" value={donorData.blockedByAdmin.name} />} */}
      </Stack>
      <ConfirmationModal
        title={donorData.isCorporatePartner ? 'Revoke Corporate Donor' : 'Make Corporate Donor'}
        onShow={showCorporateModal}
        onClose={() => setShowCorporateModal(false)}
        onConfirm={donorData.isCorporatePartner ? revokeCorporateDonor : makeCorporateDonor}
      />
      <ConfirmationModal
        title="Ban Donor"
        onShow={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={banDonor}
      />
    </DonorDetailsContainer>
  );
};

export default DonorPage;
