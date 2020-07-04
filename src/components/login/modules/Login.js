import React, { useState } from 'react';
import { Text, InputField, Stack, Heading, Button, Alert } from '@kiwicom/orbit-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import api from '../../../../api';
import useLocalStorage from '../../../../utils/hooks/useLocalStorage';

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);

	const [alertTitle, setAlertTitle] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [emailLocalStorage, setEmailLocalStorage] = useLocalStorage('email', '');

	const displayAlert = (title, description, type) => {
		setShowAlert(true);
		setAlertTitle(title);
		setAlertDescription(description);
		setAlertType(type);
  };
  
  const handleSubmitEmail = async (values) => {
    try {
      setIsLoading(true);
      const { email } = values;
      await api.auth.sendSignInLinkToEmail(email);
      setEmailLocalStorage(email);

    } catch(error) {
      setIsLoading(false);
      displayAlert('Error', error.message, 'critical');
    }
  }

	const validationSchema = Yup.object().shape({
		email: Yup.string().email().required(''),
	});

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
      handleSubmitEmail(values);
    },
	});

	return (
		<div>
			<div>
				<Text align="center" as="div" spaceAfter="largest">
					<Stack direction="column" align="center" justify="center">
						<Heading size="large" weight="bold">
							Admin Portal
						</Heading>
					</Stack>
				</Text>

				<form onSubmit={formik.handleSubmit}>
					<Stack spacing="extraLoose" spaceAfter="normal">
						<InputField
							type="email"
							label="Email"
							name="email"
							disabled={formik.isSubmitting}
							error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
							{...formik.getFieldProps('email')}
						/>

						<Button submit fullWidth={true} loading={isLoading} disabled={!formik.dirty}>
							Login
						</Button>
					</Stack>
				</form>

				{showAlert ? (
					<Alert icon title={alertTitle} type={alertType} spaceAfter="normal">
						{alertDescription}
					</Alert>
				) : null}
			</div>
		</div>
	);
};

export default Login;
