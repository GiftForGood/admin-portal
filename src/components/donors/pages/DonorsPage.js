import React, { useState, useEffect } from 'react';
import { Stack, Button, InputField } from '@kiwicom/orbit-components/';
import Table, { TableHead, TableBody, TableRow, TableCell } from '@kiwicom/orbit-components/lib/Table';
import api from '@api';
import { DONOR_TYPES } from '@constants/donor';
import { getFormattedDateTime } from '@utils/time/time';
import DonorFilters from '../modules/DonorFilters';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const SearchContainer = styled.div`
  width: 400px;
`;

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [filterType, setFilterType] = useState(DONOR_TYPES.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const onLoadMoreclicked = async () => {
    loadMoreDonors();
  };

  const loadMoreDonors = async () => {
    let lastQueriedDocument = null;
    if (donors.length > 0) {
      lastQueriedDocument = donors[donors.length - 1];
    }
    const appSnapshots = await api.donors.getAll(filterType, lastQueriedDocument);
    setDonors((prevSnapshots) => [...prevSnapshots, ...appSnapshots]);
  };

  const getAllDonors = async () => {
    try {
      const appSnapshots = await api.donors.getAll(filterType);
      setDonors(appSnapshots);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectFilter = (filterType) => {
    setFilterType(filterType);
  };

  const handleSearch = async () => {
    if (searchTerm.trim().length > 0) {
      const searchedDonor = await api.donors.searchByEmail(searchTerm.trim());
      setDonors([searchedDonor]);
    } else {
      // reset when search with empty string
      getAllDonors();
    }
  };

  const handleChangeSearchTerm = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    getAllDonors();
  }, [filterType]);

  return (
    <Stack>
      <Stack direction="row" justify="between">
        <DonorFilters onSelectedFilter={handleSelectFilter} />
        <SearchContainer>
          <Stack direction="row">
            <InputField placeholder="Donor Email" onChange={(event) => handleChangeSearchTerm(event.target.value)} />
            <Button onClick={handleSearch}>Search</Button>
          </Stack>
        </SearchContainer>
      </Stack>
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
              Is Corporate?
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {donors.map((appSnapshot, index) => {
            const donor = appSnapshot.data();
            return (
              <TableRow key={index}>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {index + 1}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {donor.name}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {donor.email}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {getFormattedDateTime(donor.lastLoggedInDateTime.toMillis())}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {`${donor.isCorporatePartner}`}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  <Stack direction="row">
                    <Button size="small" onClick={() => router.push(`/donor/${donor.userId}`)}>
                      View
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Stack justify="center">
        <Button type="secondary" onClick={onLoadMoreclicked}>
          Load More
        </Button>
      </Stack>
    </Stack>
  );
};

export default DonorsPage;
