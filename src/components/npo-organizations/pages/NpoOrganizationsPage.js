import React, { useState, useEffect } from 'react';
import { Stack, Button, InputField, Text } from '@kiwicom/orbit-components/';
import Table, { TableHead, TableBody, TableRow, TableCell } from '@kiwicom/orbit-components/lib/Table';
import api from '@api';
import Filter from '../modules/Filter';
import { ORDER_BY } from '@constants/npoOrganization';
import CreateNpoOrganizationModal from '@components/modal/CreateNpoOrganizationModal';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import { getFormattedDate, isExpiring } from '@utils/time/time';

const SearchContainer = styled.div`
  width: 400px;
`;

const NpoOrganizationsPage = () => {
  const [mode, setMode] = useState();
  const [viewOrganization, setViewOrganization] = useState(null);
  const [filterSector, setFilterSector] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const showToast = () =>
    toast.success(`NPO Organization has been successfully ${mode === 'create' ? 'created' : 'updated'}!`);

  const onShowCreateModal = () => {
    setMode('create');
    setViewOrganization(null);
    setShowCreateModal(true);
  };

  const onShowEditModal = (organization) => {
    setMode('edit');
    setViewOrganization(organization);
    setShowCreateModal(true);
  };

  const rerenderTable = () => {
    getAllOrganizationsForSector();
  };

  const onHideCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleChangeSearchTerm = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleSearch = async () => {
    if (searchTerm.trim().length > 0) {
      const searchedNpoOrganization = await api.npoOrganizations.getByUEN(searchTerm.trim());
      setOrganizations(searchedNpoOrganization);
    } else {
      getAllOrganizationsForSector();
    }
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
        title={mode === 'create' ? 'Create NPO Organization' : 'NPO Organization'}
        showToast={showToast}
        mode={mode}
        npoOrganization={viewOrganization}
        rerenderTable={rerenderTable}
      />
      <Stack direction="row" justify="between">
        <Filter onSelectedFilter={onSelectedFilter} />
        <SearchContainer>
          <Stack direction="row">
            <InputField
              placeholder="NPO Organization UEN"
              onChange={(event) => handleChangeSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch}>Search</Button>
          </Stack>
        </SearchContainer>
      </Stack>

      <Stack direction="row" justify="end">
        <Button onClick={() => onShowCreateModal()}>Create NPO Organization</Button>
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

            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Date Started
            </TableCell>

            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Date Renewed
            </TableCell>

            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Date of Expiry
            </TableCell>

            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        {organizations !== null && (
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

                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {appSnapshot.data().dateStarted ? getFormattedDate(appSnapshot.data().dateStarted?.toMillis()) : null}
                </TableCell>

                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {appSnapshot.data().dateRenewed ? getFormattedDate(appSnapshot.data().dateRenewed?.toMillis()) : null}
                </TableCell>

                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  <Text
                    type={
                      appSnapshot.data().dateOfExpiry
                        ? isExpiring(appSnapshot.data()?.dateOfExpiry?.toMillis())
                          ? 'critical'
                          : 'primary'
                        : null
                    }
                  >
                    {appSnapshot.data().dateOfExpiry ? (
                      <>
                        {getFormattedDate(appSnapshot.data().dateOfExpiry?.toMillis())}
                        {isExpiring(appSnapshot.data().dateOfExpiry?.toMillis()) ? 'Expiring soon' : null}
                      </>
                    ) : null}
                  </Text>
                </TableCell>

                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  <Stack direction="row" justify="center">
                    <Button size="small" onClick={() => onShowEditModal(appSnapshot.data())}>
                      View
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
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
