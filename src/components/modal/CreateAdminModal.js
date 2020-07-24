import React from 'react';
import { Button, Heading, Stack, InputField } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateAdminModal = ({ show, onHide, onClickCreate, title }) => {
  if (!show) {
    return <div></div>;
  }

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
      onClickCreate(values.email, values.name);
    },
  });

  return (
    <Modal size="small">
      <ModalSection>
        <Stack spacing="condensed" spaceAfter="large">
          <Heading type="title2">{title}</Heading>
        </Stack>
        <Stack spacing="comfy">
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
        </Stack>
      </ModalSection>
      <ModalFooter>
        <Stack direction="row" justify="end" align="center">
          <Button type="secondary" onClick={onHide} disabled={formik.isSubmitting}>
            Cancel
          </Button>
          <Button submit disabled={formik.isSubmitting} onClick={formik.handleSubmit}>
            Create
          </Button>
        </Stack>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAdminModal;
