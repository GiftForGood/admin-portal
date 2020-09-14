import React, { useState, useEffect } from 'react';
import { Stack, Button, Text, Heading } from '@kiwicom/orbit-components/';
import api from '@api';
import { DONOR_TYPES } from '@constants/donor';
import ConfirmationModal from '../modules/ConfirmationModal';
import { getFormattedDateTime } from '@utils/time/time';
import styled from 'styled-components';

const DonorDetailsContainer = styled.div`
  margin-top: 100px;
`;

const DonorPage = ({ donorId }) => {
  const [donor, setDonor] = useState(null);
  const [showCorporateModal, setShowCorporateModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    api.donors.get(donorId).then((donor) => setDonor(donor));
  }, []);

  const makeCorporateDonor = () => {
    setShowCorporateModal(false);
  };

  const banDonor = () => {
    setShowBanModal(false);
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
      <Heading spaceAfter="largest">Donor Details</Heading>
      <Stack>
        <Text>Name: {donorData.name}</Text>
        <Text>Email: {donorData.email}</Text>
        <Text>Last Logged-in Date: {getFormattedDateTime(donorData.lastLoggedInDateTime.toMillis())}</Text>
        <Text>Donor Type: {donorData.isCorporatePartner ? DONOR_TYPES.CORPORATE : DONOR_TYPES.NORMAL}</Text>
        <Stack direction="row">
          <Button disabled={donorData.isCorporatePartner} onClick={openCorporateModal}>
            Make Corporate
          </Button>
          <Button type="critical" onClick={openBanModal}>
            Ban
          </Button>
        </Stack>
      </Stack>
      <ConfirmationModal
        title="Make Corporate Donor"
        onShow={showCorporateModal}
        onClose={() => setShowCorporateModal(false)}
        onConfirm={makeCorporateDonor}
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
