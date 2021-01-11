import React, { useState, useEffect } from 'react';
import { TYPE, SECTOR } from '@constants/npoOrganization';
import { Alert, Select, InputField, Button, Heading, Stack, Text } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';
import api from '@api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const CreateNpoOrganizationModal = ({ show, onHide, title, showToast, mode, npoOrganization, rerenderTable }) => {
  if (!show) {
    return <div></div>;
  }

  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [editNpoOrganization, setEditNpoOrganization] = useState(null);
  const [isGroundUp, setIsGroundUp] = useState(false);

  //tempo
  const [todayDate, setTodayDate] = useState(new Date());

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  // Used to edit npo organization
  useEffect(() => {
    if (npoOrganization) {
      let editNpoOrganization = {
        name: npoOrganization.name,
        type: npoOrganization.type,
        uen: npoOrganization.uen,
        address: npoOrganization.address,
        sector: npoOrganization.sector,
        classification: npoOrganization.classification,
        website: npoOrganization.website,
        dateStarted: new Date(npoOrganization?.dateStarted?.toMillis()),
        dateRenewed: new Date(npoOrganization?.dateRenewed?.toMillis()),
        dateOfExpiry: new Date(npoOrganization?.dateOfExpiry?.toMillis()),
      };
      setEditNpoOrganization(editNpoOrganization);
    }
  }, [npoOrganization]);

  const handleFormSubmission = (values) => {
    if (mode === 'create') {
      handleCreateNpoOrganization(values);
    } else if (mode === 'edit') {
      handleEditNpoOrganization(values);
    }
  };

  const handleCreateNpoOrganization = (values) => {
    const {
      name,
      type,
      uen,
      address,
      sector,
      classification,
      website,
      dateStarted,
      dateRenewed,
      dateOfExpiry,
    } = values;
    const groundUpDateStarted = {
      day: dateStarted.getDate(),
      month: dateStarted.getMonth() + 1,
      year: dateStarted.getFullYear(),
    };

    const groundUpDateRenewed = {
      day: dateRenewed.getDate(),
      month: dateRenewed.getMonth() + 1,
      year: dateRenewed.getFullYear(),
    };

    const groundUpDateOfExpiry = {
      day: dateOfExpiry.getDate(),
      month: dateOfExpiry.getMonth() + 1,
      year: dateOfExpiry.getFullYear(),
    };

    api.npoOrganizations
      .create(
        name,
        type,
        uen,
        address,
        sector,
        classification,
        website,
        groundUpDateStarted,
        groundUpDateRenewed,
        groundUpDateOfExpiry
      )
      .then(() => {
        onHide();
        showToast();
        rerenderTable();
      })
      .catch((error) => {
        formik.setSubmitting(false);
        console.log(error.code);
        if (error.code === 'npo-organization/invalid-npo-type') {
          displayAlert('Invalid NPO Type', error.message, 'critical');
        } else if (error.code === 'npo-organization/invalid-npo-sector') {
          displayAlert('Invalid NPO Sector', error.message, 'critical');
        } else if (error.code === 'npo-organization/invalid-npo-name') {
          displayAlert('Invalid NPO Name', error.message, 'critical');
        } else if (error.code === 'npo-organization/failed-to-fetch-lat-long') {
          displayAlert('Failed to fetch lat and long', error.message, 'critical');
        } else {
          displayAlert('Error', error.message, 'critical');
        }
      });
  };

  const handleEditNpoOrganization = (values) => {
    const {
      name,
      type,
      uen,
      address,
      sector,
      classification,
      website,
      dateStarted,
      dateRenewed,
      dateOfExpiry,
    } = values;
    const groundUpDateStarted = {
      day: dateStarted.getDate(),
      month: dateStarted.getMonth() + 1,
      year: dateStarted.getFullYear(),
    };

    const groundUpDateRenewed = {
      day: dateRenewed.getDate(),
      month: dateRenewed.getMonth() + 1,
      year: dateRenewed.getFullYear(),
    };

    const groundUpDateOfExpiry = {
      day: dateOfExpiry.getDate(),
      month: dateOfExpiry.getMonth() + 1,
      year: dateOfExpiry.getFullYear(),
    };

    api.npoOrganizations
      .update(
        npoOrganization.id,
        name,
        address,
        classification,
        sector,
        type,
        uen,
        website,
        groundUpDateStarted,
        groundUpDateRenewed,
        groundUpDateOfExpiry
      )
      .then(() => {
        onHide();
        showToast();
        rerenderTable();
      })
      .catch((error) => {
        formik.setSubmitting(false);
        console.log(error.code);
        if (error.code === 'npo-organization/invalid-npo-type') {
          displayAlert('Invalid NPO Type', error.message, 'critical');
        } else if (error.code === 'npo-organization/invalid-npo-sector') {
          displayAlert('Invalid NPO Sector', error.message, 'critical');
        } else if (error.code === 'npo-organization/invalid-npo-id') {
          displayAlert('Invalid NPO Id', error.message, 'critical');
        } else if (error.code === 'npo-organization/failed-to-fetch-lat-long') {
          displayAlert('Failed to fetch lat and long', error.message, 'critical');
        } else {
          displayAlert('Error', error.message, 'critical');
        }
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    type: Yup.string().required('Required'),
    uen: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    sector: Yup.string().required('Required'),
    classification: Yup.string().required('Required'),
    website: Yup.string().required('Required').url(),
    dateStarted: Yup.date(),
    dateRenewed: Yup.date(),
    dateOfExpiry: Yup.date(),
  });

  const formik = useFormik({
    initialValues: editNpoOrganization || {
      name: '',
      type: '',
      uen: '',
      address: '',
      sector: '',
      classification: '',
      website: '',
      dateStarted: todayDate,
      dateRenewed: todayDate,
      dateOfExpiry: todayDate,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  return (
    <>
      <Modal size="small">
        <ModalSection>
          <Stack spacing="condensed" spaceAfter="largest">
            <Heading type="title2">{title}</Heading>
          </Stack>
          <Stack spacing="comfy">
            <InputField
              disabled={formik.isSubmitting}
              type="text"
              label="Name"
              name="name"
              placeholder="Organization Name"
              error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
              {...formik.getFieldProps('name')}
            />
            <InputField
              disabled={formik.isSubmitting}
              type="text"
              label="Registration Number (UEN)"
              name="uen"
              placeholder="Registration Number"
              error={formik.touched.uen && formik.errors.uen ? formik.errors.uen : ''}
              {...formik.getFieldProps('uen')}
            />
            <InputField
              disabled={formik.isSubmitting}
              type="text"
              label="Address"
              name="address"
              placeholder="Organization Address"
              error={formik.touched.address && formik.errors.address ? formik.errors.address : ''}
              {...formik.getFieldProps('address')}
            />
            <Select
              disabled={formik.isSubmitting}
              name="type"
              label="Type"
              options={Object.values(TYPE).map((type) => {
                return {
                  label: type,
                  value: type,
                };
              })}
              placeholder="Organization Type"
              size="normal"
              {...formik.getFieldProps('type')}
              error={formik.touched.type && formik.errors.type ? formik.errors.type : ''}
            />

            {formik.values.type === TYPE.GROUND_UP ? (
              <>
                <Stack spacing="none">
                  <Text>Date Started (GroundUps only)</Text>
                  <DatePicker
                    selected={formik.values.dateStarted}
                    onChange={(date) => {
                      formik.setFieldValue('dateStarted', date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    dateFormatCalendar="dd/MM/yyyy"
                  />
                </Stack>
                <Stack spacing="none">
                  <Text>Date Renewed (GroundUps only)</Text>
                  <DatePicker
                    selected={formik.values.dateRenewed}
                    onChange={(date) => {
                      formik.setFieldValue('dateRenewed', date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    dateFormatCalendar="dd/MM/yyyy"
                  />
                </Stack>
                <Stack spacing="none">
                  <Text>Date of Expiry (GroundUps only)</Text>

                  <DatePicker
                    selected={formik.values.dateOfExpiry}
                    onChange={(date) => {
                      formik.setFieldValue('dateOfExpiry', date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    dateFormatCalendar="dd/MM/yyyy"
                  />
                </Stack>
              </>
            ) : null}

            <Select
              disabled={formik.isSubmitting}
              name="sector"
              label="Sector"
              options={Object.values(SECTOR).map((sector) => {
                return {
                  label: sector,
                  value: sector,
                };
              })}
              placeholder="Organization Sector"
              size="normal"
              {...formik.getFieldProps('sector')}
              error={formik.touched.sector && formik.errors.sector ? formik.errors.sector : ''}
            />

            <InputField
              disabled={formik.isSubmitting}
              type="text"
              label="Classification"
              name="classification"
              placeholder="Organization Classification"
              error={formik.touched.classification && formik.errors.classification ? formik.errors.classification : ''}
              {...formik.getFieldProps('classification')}
            />

            <InputField
              disabled={formik.isSubmitting}
              type="text"
              label="Website"
              name="website"
              placeholder="Website"
              error={formik.touched.website && formik.errors.website ? formik.errors.website : ''}
              {...formik.getFieldProps('website')}
            />

            {showAlert ? (
              <Alert icon title={alertTitle} type={alertType}>
                {alertDescription}
              </Alert>
            ) : null}
          </Stack>
        </ModalSection>
        <ModalFooter>
          <Stack direction="row" justify="end" align="center">
            <Button type="secondary" onClick={onHide} disabled={formik.isSubmitting}>
              Cancel
            </Button>
            <Button submit disabled={formik.isSubmitting} loading={formik.isSubmitting} onClick={formik.handleSubmit}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Stack>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CreateNpoOrganizationModal;
