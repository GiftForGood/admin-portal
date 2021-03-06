import React, { useEffect, useState } from 'react';
import { InputField, Stack, Button, Textarea, Alert, Card, CardSection } from '@kiwicom/orbit-components/';
import { getFormattedDateTime } from '@utils/time/time';
import styled from 'styled-components';
import useUser from '@components/session/modules/useUser';
import api from '@api';
import { useRouter } from 'next/router';
import { STATUS } from '@constants/npoVerification';
import BadgeStatus from '../modules/BadgeStatus';
import AcceptNpoVerificationModal from '@components/modal/AcceptNpoVerificationModal';
import RejectNpoVerificationModal from '@components/modal/RejectNpoVerificationModal';
import ResubmissionNpoVerificationModal from '@components/modal/ResubmissionNpoVerificationModal';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const LeftSideButtons = ({ admin, npoApplicationId, status, onError, removeError }) => {
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
        // not mine
        if (isReviewing) {
          setIsDisabled(true);
          setButtonText('Someone reviewing');
        } else {
          setIsDisabled(false);
          setButtonText('Lock for review');
        }
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
    const isReviewing = status === STATUS.REVIEWING;
    if (admin && admin.id && isMeHandlingApplication(admin) && isReviewing) {
      // unlock
      removeError();
      setIsLoading(true);
      api.npoVerifications
        .unlockForReview(npoApplicationId)
        .then(() => {
          router.reload();
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error.message);
          onError(error.message);
        });
    } else {
      // lock
      removeError();
      setIsLoading(true);
      api.npoVerifications
        .lockForReview(npoApplicationId)
        .then(() => {
          router.reload();
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error.message);
          onError(error.message);
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

const RightSideButtons = ({ admin, npoApplicationId, status, onError, removeError }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showResubmissionModal, setShowResubmissionModal] = useState(false);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (admin && admin.id) {
      const isMine = isMeHandlingApplication(admin);
      const isReviewing = status === STATUS.REVIEWING;
      if (isMine) {
        if (isReviewing) {
          setIsDisabled(false);
        } else {
          setIsDisabled(true); // mine && not reviewing ==> cannot accept/reject/resubmission
        }
      } else {
        // not mine ==> cannot accept/reject/resubmission
        setIsDisabled(true);
      }
    } else {
      setIsDisabled(true);
    }
  }, [admin, user]);

  const isMeHandlingApplication = (admin) => {
    if (user) {
      return user.adminId === admin.id;
    }
  };

  const onHideAcceptModal = () => {
    setShowAcceptModal(false);
  };

  const onHideRejectModal = () => {
    setShowRejectModal(false);
  };

  const onHideResubmissionModal = () => {
    setShowResubmissionModal(false);
  };

  const onClickAccept = () => {
    removeError();
    api.npoVerifications
      .accept(npoApplicationId)
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        console.error(error.message);
        onError(error.message);
      });
  };

  const onClickReject = (reason) => {
    removeError();
    api.npoVerifications
      .reject(npoApplicationId, reason)
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        console.error(error.message);
        onError(error.message);
      });
  };

  const onClickResubmission = (reason) => {
    removeError();
    api.npoVerifications
      .requestForResubmission(npoApplicationId, reason)
      .then(() => {
        router.reload();
      })
      .catch((error) => {
        console.error(error.message);
        onError(error.message);
      });
  };

  return (
    <Stack inline direction="row" spacing="condensed" justify="end">
      <Button disabled={isDisabled} type="secondary" onClick={() => setShowResubmissionModal(true)}>
        Resubmission
      </Button>
      <Button disabled={isDisabled} type="critical" onClick={() => setShowRejectModal(true)}>
        Reject
      </Button>
      <Button disabled={isDisabled} onClick={() => setShowAcceptModal(true)}>
        Accept
      </Button>

      <AcceptNpoVerificationModal
        show={showAcceptModal}
        onHide={onHideAcceptModal}
        onClickAccept={onClickAccept}
        title="Accept"
        description="Are you sure you want to accept this NPO?"
      />
      <RejectNpoVerificationModal
        show={showRejectModal}
        onHide={onHideRejectModal}
        onClickReject={onClickReject}
        title="Reject"
        description="Reason for rejecting application:"
      />
      <ResubmissionNpoVerificationModal
        show={showResubmissionModal}
        onHide={onHideResubmissionModal}
        onClickRequest={onClickResubmission}
        title="Request Resubmission"
        description="Reason for requesting resubmission:"
      />
    </Stack>
  );
};

const UenCard = ({ success, organizations }) => {
  return (
    <Card title="UEN Checker">
      <CardSection>
        {success ? (
          <Alert icon title={`${organizations.length} match(es) found`} type="success" spaceAfter="large" />
        ) : (
          <Alert icon title="No match found" type="critical" spaceAfter="large" />
        )}

        {organizations
          ? organizations.map((organization) => (
              <Card>
                <CardSection expanded>
                  <Stack>
                    <InputField readOnly label="UEN Registration Number" value={organization.uen} />

                    <InputField readOnly label="Organization Name" value={organization.name} />

                    <InputField readOnly label="Address" value={organization.address} />

                    <InputField readOnly label="Sector" value={organization.sector} />

                    <InputField readOnly label="Classification" value={organization.classification} />
                  </Stack>
                </CardSection>
              </Card>
            ))
          : null}
      </CardSection>
    </Card>
  );
};

const EmailCard = ({ emailVerified = false }) => {
  return (
    <Card title="Email Checker">
      <CardSection>
        {emailVerified ? (
          <Alert icon title={'Email has been verified by user'} type="success" spaceAfter="large" />
        ) : (
          <Alert icon title="Email has not been verified by user yet" type="critical" spaceAfter="large" />
        )}
      </CardSection>
    </Card>
  );
};

const NpoApplicationPage = ({ npoApplicationId }) => {
  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const [showUenCheck, setShowUenCheck] = useState(false);
  const [uenDetails, setUenDetails] = useState([]);

  const [showEmailCheck, setShowEmailCheck] = useState(false);
  const [emailDetails, setEmailDetails] = useState(null);

  const [npoApplicationDetails, setNpoApplicationDetails] = useState(null);

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const getNpoApplicationDetails = async (npoApplicationId) => {
    const appSnapshot = await api.npoVerifications.get(npoApplicationId).catch((err) => console.error(err));
    return appSnapshot.data() ? appSnapshot.data() : {};
  };

  useEffect(() => {
    getNpoApplicationDetails(npoApplicationId).then((npoApplication) => {
      deserializeFirestoreTimestampToUnixTimestamp(npoApplication);
      setNpoApplicationDetails(npoApplication);
    });
  }, []);

  const onError = (errorMessage) => {
    displayAlert('Error', errorMessage, 'critical');
  };

  const checkUen = async () => {
    try {
      setShowUenCheck(false);
      const orgsDocs = await api.npoOrganizations.getByUEN(npoApplicationDetails.organization.registrationNumber);
      if (orgsDocs === null) {
        throw new Error(
          `organization with UEN of ${npoApplicationDetails.organization.registrationNumber} does not exist`
        );
      }
      const orgs = orgsDocs.map((orgDocs) => orgDocs.data());
      setShowUenCheck(true);
      setUenDetails(orgs);
    } catch (error) {
      console.error(error.message);
      setShowUenCheck(true);
    }
  };

  const checkEmail = async () => {
    try {
      setShowEmailCheck(false);
      const emailDetails = await api.npoVerifications.getEmailVerified(npoApplicationId);
      setShowEmailCheck(true);
      setEmailDetails(emailDetails);
    } catch (error) {
      console.error(error.message);
      setShowEmailCheck(true);
    }
  };

  if (npoApplicationDetails === null) {
    return <div></div>;
  }

  return (
    <Container>
      <Stack>
        {showAlert ? (
          <Alert icon title={alertTitle} type={alertType}>
            {alertDescription}
          </Alert>
        ) : null}

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
            onError={onError}
            removeError={() => setShowAlert(false)}
          />
          <RightSideButtons
            admin={npoApplicationDetails.admin ? npoApplicationDetails.admin : null}
            npoApplicationId={npoApplicationId}
            status={npoApplicationDetails.status}
            onError={onError}
            removeError={() => setShowAlert(false)}
          />
        </Stack>
        <BadgeStatus status={npoApplicationDetails.status} />

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

        <Stack direction="column" desktop={{ direction: 'row', align: 'end' }}>
          <InputField readOnly label="Email" value={npoApplicationDetails.email} />
          <Button onClick={checkEmail}>Check</Button>
        </Stack>

        {showEmailCheck ? <EmailCard emailVerified={emailDetails ? emailDetails.emailVerified : false} /> : null}

        <InputField
          readOnly
          label="Date Applied for GFG"
          value={getFormattedDateTime(npoApplicationDetails.appliedDateTime)}
        />

        <InputField readOnly label="Name" value={npoApplicationDetails.name} />

        <InputField readOnly label="Contact Number" value={npoApplicationDetails.contactNumber} />

        <Stack direction="column" desktop={{ direction: 'row', align: 'end' }}>
          <InputField
            readOnly
            label="UEN Registration Number"
            value={npoApplicationDetails.organization.registrationNumber}
          />
          <Button onClick={checkUen}>Check</Button>
        </Stack>

        {showUenCheck ? <UenCard success={uenDetails.length > 0 ? true : false} organizations={uenDetails} /> : null}
      </Stack>
    </Container>
  );
};

export default NpoApplicationPage;
