import React, { useState, useEffect } from 'react';
import { Stack, Button } from '@kiwicom/orbit-components/';
import Table, { TableHead, TableBody, TableRow, TableCell } from '@kiwicom/orbit-components/lib/Table';
import api from '@api';
import { getFormattedDateTime } from '@utils/time/time';
import CreateAdminModal from '@components/modal/createAdmin/CreateAdminModal';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const onHideCreateModal = () => {
    setShowCreateModal(false);
  };

  const rerenderTable = () => {
    getAllAdmins();
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
        rerenderTable={rerenderTable}
      />
      <Button onClick={() => setShowCreateModal(true)}>Create Admin</Button>
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
          {admins.map((appSnapshot, index) => {
            const data = appSnapshot.data();
            deserializeFirestoreTimestampToUnixTimestamp(data);
            const { name, email, lastLoggedInDateTime, createdBy } = data;
            return (
              <TableRow key={index}>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {index + 1}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {name}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {email}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {getFormattedDateTime(lastLoggedInDateTime)}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {createdBy.adminName}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Stack>
  );
};

export default AdminsPage;
