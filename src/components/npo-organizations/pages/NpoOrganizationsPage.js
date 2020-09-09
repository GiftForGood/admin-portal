import React, { useState, useEffect } from 'react';
import { Stack, Button } from '@kiwicom/orbit-components/';
import Table, { TableHead, TableBody, TableRow, TableCell } from '@kiwicom/orbit-components/lib/Table';
import api from '@api';
import Filter from '@components/modules/Filter';
import { ORDER_BY } from '@constants/npoOrganization';
import CreateNpoOrganizationModal from '@components/modal/CreateNpoOrganizationModal';
import { ToastContainer, toast } from 'react-toastify';

const NpoOrganizationsPage = () => {
  const [filterSector, setFilterSector] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const showToast = () => toast.success('NPO Organization has been successfully created!');

  const onHideCreateModal = () => {
    setShowCreateModal(false);
  };

  const loadMoreOrganizations = async () => {
    try {
      let lastQueriedDocument = null;
      if (organizations.length > 0) {
        lastQueriedDocument = organizations[organizations.length - 1];
      }

      const appSnapshots = await api.npoOrganizations.getAllBySector(
        filterSector,
        ORDER_BY.NAME,
        false,
        lastQueriedDocument
      );
      setOrganizations([...organizations, ...appSnapshots]);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllOrganizationsForSector = async () => {
    try {
      const appSnapshots = await api.npoOrganizations.getAllBySector(filterSector);
      setOrganizations(appSnapshots);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllOrganizationsForSector();
  }, [filterSector]);

  const onSelectedFilter = (sector) => {
    setFilterSector(sector);
  };

  const onLoadMoreClick = async () => {
    loadMoreOrganizations();
  };

  return (
    <Stack>
      <CreateNpoOrganizationModal
        show={showCreateModal}
        onHide={onHideCreateModal}
        title="Create NPO Organization"
        showToast={showToast}
      />
      <Stack direction="row" justify="between">
        <Filter onSelectedFilter={onSelectedFilter} />
        <Button onClick={() => setShowCreateModal(true)}>Create NPO Organization</Button>
      </Stack>
      <Table striped type="primary">
        <TableHead>
          <TableRow>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              #
            </TableCell>
            <TableCell align="left" verticalAlign="baseline" whiteSpace="nowrap">
              Name
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              UEN
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Sector
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Type
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {organizations.map((appSnapshot, index) => (
            <TableRow key={index}>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {index + 1}
              </TableCell>
              <TableCell align="left" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().name}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().uen}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().sector}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().type}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Stack justify="center">
        <Button type="secondary" onClick={onLoadMoreClick}>
          Load More
        </Button>
      </Stack>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={true} closeButton={false} />
    </Stack>
  );
};

export default NpoOrganizationsPage;
