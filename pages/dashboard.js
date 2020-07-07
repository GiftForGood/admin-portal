import React from 'react';
import { isAuthenticated } from '../utils/authentication/authentication';

export async function getServerSideProps({ params, req, res, query }) {
  let data = await isAuthenticated(req, res, { Location: '/' });
	return {
		props: {
			user: data.user || null
		},
	};
}


const Dashboard = ({ user }) => {
  return (
    <div>Dashboard {user && user.email}</div>
  )
}

export default Dashboard;