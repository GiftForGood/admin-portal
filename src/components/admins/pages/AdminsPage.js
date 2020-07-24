import React, { useState, useEffect } from 'react';
import { Stack, Button } from '@kiwicom/orbit-components/';
import Table, { TableHead, TableBody, TableRow, TableCell } from '@kiwicom/orbit-components/lib/Table';
import api from '../../../../api';
import { getFormattedDateTime } from '../../../../utils/time/time';
import CreateAdminModal from '../../modal/CreateAdminModal';

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const onHideCreateModal = () => {
    setShowCreateModal(false);
  };

  const onClickCreate = (email, name) => {
    api.admins
      .createFromExistingAccount(email, name)
      .then(() => {
        setShowCreateModal(false);
        getAllAdmins();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getAllAdmins = async () => {
    try {
      const appSnapshots = await api.admins.getAll();
      setAdmins(appSnapshots);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAdmins();
  }, []);

  return (
    <Stack>
      <CreateAdminModal
        show={showCreateModal}
        onHide={onHideCreateModal}
        title="Create Admin"
        onClickCreate={onClickCreate}
      />
      <Button onClick={() => setShowCreateModal(true)}>Create new Admin</Button>
      <Table striped type="primary">
        <TableHead>
          <TableRow>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              #
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Name
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Email
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Last Login On
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Created By
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {admins.map((appSnapshot, index) => (
            <TableRow key={index}>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {index + 1}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().name}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().email}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {getFormattedDateTime(appSnapshot.data().lastLoggedInDateTime)}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().createdBy.adminName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

export default AdminsPage;
