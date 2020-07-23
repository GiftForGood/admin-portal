import React, { useEffect, useState } from 'react';
import { InputField, Stack, Button, Textarea } from '@kiwicom/orbit-components/';
import { getFormattedDateTime } from '../../../../utils/time/time';
import styled from 'styled-components';
import useUser from '../../session/modules/useUser';
import api from '../../../../api';
import { useRouter } from 'next/router';
import { STATUS } from '../../../../utils/constants/npoVerification';
import BadgeStatus from '../modules/BadgeStatus';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const LeftSideButtons = ({ admin, npoApplicationId, status }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [buttonText, setButtonText] = useState('');
  const [loading, setIsLoading] = useState(false);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (admin && admin.id) {
      const isMine = isMeHandlingApplication(admin);
      const isReviewing = status === STATUS.REVIEWING;
      if (isMine) {
        if (isReviewing) {
          setIsDisabled(false);
          setButtonText('Unlock from reviewing');
        } else {
          setIsDisabled(false);
          setButtonText('Lock for review');
        }
      } else {
        setIsDisabled(true);
        setButtonText('Someone reviewing');
      }
    } else {
      setIsDisabled(false);
      setButtonText('Lock for review');
    }
  }, [admin, user]);

  const isMeHandlingApplication = (admin) => {
    if (user) {
      return user.adminId === admin.id;
    }
  };

  const handleLockUnlockForReview = () => {
    if (admin && admin.id && isMeHandlingApplication(admin)) {
      // unlock
      setIsLoading(true);
      api.npoVerifications
        .unlockForReview(npoApplicationId)
        .then(() => {
          router.reload();
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error.message);
        });
    } else {
      // lock
      setIsLoading(true);
      api.npoVerifications
        .lockForReview(npoApplicationId)
        .then(() => {
          router.reload();
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error.message);
        });
    }
  };

  return (
    <>
      <Button disabled={isDisabled} onClick={handleLockUnlockForReview} loading={loading}>
        {buttonText}
      </Button>
    </>
  );
};

const RightSideButtons = () => {
  return (
    <Stack inline direction="row" spacing="condensed" justify="end">
      <Button type="secondary">Resubmission</Button>
      <Button type="critical">Reject</Button>
      <Button>Accept</Button>
    </Stack>
  );
};

const NpoApplicationPage = ({ npoApplicationDetails, npoApplicationId }) => {
  return (
    <Container>
      <Stack>
        <Stack
          direction="column"
          desktop={{
            direction: 'row',
          }}
          tablet={{
            direction: 'row',
          }}
          justify="between"
          basis="auto"
          grow
        >
          <LeftSideButtons
            admin={npoApplicationDetails.admin ? npoApplicationDetails.admin : null}
            npoApplicationId={npoApplicationId}
            status={npoApplicationDetails.status}
          />
          <RightSideButtons />
        </Stack>
        <BadgeStatus status={npoApplicationDetails.status} />
        <InputField
          readOnly
          label="Personnel In-charge"
          value={npoApplicationDetails.admin ? npoApplicationDetails.admin.name : null}
        />

        <InputField
          readOnly
          label="Personnel In-charge"
          value={npoApplicationDetails.admin ? npoApplicationDetails.admin.name : null}
        />

        <InputField readOnly label="NPO Organization" value={npoApplicationDetails.organization.name} />

        <Textarea
          readOnly
          label="NPO Organization Activities"
          value={npoApplicationDetails.organization.activities}
          rows={5}
        />

        <InputField readOnly label="Email" value={npoApplicationDetails.email} />

        <InputField
          readOnly
          label="Date Applied for GFG"
          value={getFormattedDateTime(npoApplicationDetails.appliedDateTime)}
        />

        <InputField readOnly label="Name" value={npoApplicationDetails.name} />

        <InputField readOnly label="Contact Number" value={npoApplicationDetails.contactNumber} />

        <InputField
          readOnly
          label="UEN Registration Number"
          value={npoApplicationDetails.organization.registrationNumber}
        />

        <InputField
          readOnly
          label="Date of registration for Charity"
          value={getFormattedDateTime(npoApplicationDetails.organization.dateOfRegistration)}
        />
      </Stack>
    </Container>
  );
};

export default NpoApplicationPage;
