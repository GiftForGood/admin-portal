import React, { useState } from 'react';
import { Alert, Button, Stack, InputField, Text } from '@kiwicom/orbit-components/lib';
import api from '@api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const NewAccount = ({ onHide, rerenderTable }) => {
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
      .createWithNewAccount(values.email, values.password, values.name)
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
    password: Yup.string()
      .required('Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$%\^&\*\-\+\=\?\;\:\[\]\{\}\|\`\~\"\'\_\.])(?=.{12,})/,
        'Please create a password with at least 12 characters, comprising a mix of uppercase and lowercase letters, numbers and symbols'
      ),
    passwordConfirmation: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
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
        <Stack spacing="none">
          <InputField
            disabled={formik.isSubmitting}
            type="password"
            label="Create a password"
            name="password"
            error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password ? null : (
            <Text size="small" type="secondary">
              Please create a password with at least 12 characters, comprising a mix of uppercase and lowercase letters,
              numbers and symbols
            </Text>
          )}
        </Stack>
        <InputField
          disabled={formik.isSubmitting}
          type="password"
          label="Confirm password"
          name="passwordConfirm"
          error={
            formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
              ? formik.errors.passwordConfirmation
              : ''
          }
          {...formik.getFieldProps('passwordConfirmation')}
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

export default NewAccount;
