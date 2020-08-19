import React, { useState } from 'react';
import { Alert, Button, Stack, InputField } from '@kiwicom/orbit-components/lib';
import api from '../../../../../api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ExistingAccount = ({ onHide, rerenderTable }) => {
  const [alertTitle, setAlertTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const displayAlert = (title, description, type) => {
    setShowAlert(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertType(type);
  };

  const handleFormSubmission = (values) => {
    api.admins
      .createFromExistingAccount(values.email, values.name)
      .then(() => {
        onHide();
        rerenderTable();
      })
      .catch((error) => {
        console.error(error);
        formik.setSubmitting(false);
        displayAlert('Error', error.message, 'critical');
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email').required('Required'),
    name: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmission(values);
    },
  });

  return (
    <>
      <Stack spacing="comfy" spaceAfter="large">
        <InputField
          disabled={formik.isSubmitting}
          type="email"
          label="Email"
          name="email"
          placeholder="e.g. name@email.com"
          error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
          {...formik.getFieldProps('email')}
        />
        <InputField
          disabled={formik.isSubmitting}
          type="text"
          label="Name"
          name="name"
          placeholder="Name"
          error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
          {...formik.getFieldProps('name')}
        />
        {showAlert ? (
          <Alert icon title={alertTitle} type={alertType}>
            {alertDescription}
          </Alert>
        ) : null}
      </Stack>
      <Stack direction="row" justify="end" align="center">
        <Button type="secondary" onClick={onHide} disabled={formik.isSubmitting}>
          Cancel
        </Button>
        <Button submit disabled={formik.isSubmitting} loading={formik.isSubmitting} onClick={formik.handleSubmit}>
          Create
        </Button>
      </Stack>
    </>
  );
};

export default ExistingAccount;
