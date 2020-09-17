import React, { useState, useEffect } from 'react';
import { TYPE, SECTOR } from '@constants/npoOrganization';
import { Alert, Select, InputField, Button, Heading, Stack } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';
import api from '@api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateNpoOrganizationModal = ({ show, onHide, title, showToast, mode, npoOrganization, rerenderTable }) => {
  if (!show) {
    return <div></div>;
  }

  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [editNpoOrganization, setEditNpoOrganization] = useState(null);

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
    api.npoOrganizations
      .create(values.name, values.type, values.uen, values.address, values.sector, values.classification)
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
    api.npoOrganizations
      .update(
        npoOrganization.id,
        values.name,
        values.address,
        values.classification,
        values.sector,
        values.type,
        values.uen
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
  });

  const formik = useFormik({
    initialValues: editNpoOrganization || {
      name: '',
      type: '',
      uen: '',
      address: '',
      sector: '',
      classification: '',
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
