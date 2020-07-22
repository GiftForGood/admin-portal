import React, { useState, useEffect } from 'react';
import { Stack, Button } from '@kiwicom/orbit-components/';
import Table, { TableHead, TableBody, TableRow, TableCell } from '@kiwicom/orbit-components/lib/Table';
import api from '../../../../api';
import { getFormattedDateTime } from '../../../../utils/time/time';
import { useRouter } from 'next/router';
import BadgeStatus from '../modules/BadgeStatus';
import Filter from '../modules/Filter';

const NpoApplicationsPage = () => {
  const [filterStatus, setFilterStatus] = useState();
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  const getAllApplications = async () => {
    try {
      const appSnapshots = await api.npoVerifications.getAll(filterStatus);
      setApplications(appSnapshots);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllApplications();
  }, [filterStatus]);

  const onSelectedFilter = (status) => {
    setFilterStatus(status);
  };

  const onReviewClicked = (npoApplicationId) => {
    router.push(`/npo-applications/${npoApplicationId}`);
  };

  return (
    <Stack>
      <Filter onSelectedFilter={onSelectedFilter} />
      <Table dataTest="test" striped type="primary">
        <TableHead>
          <TableRow>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              #
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              NPO Organization
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Name
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Date Applied
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Status
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Personnel In-charge
            </TableCell>
            <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {applications.map((appSnapshot, index) => (
            <TableRow>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {index + 1}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().organization.name}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().name}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {getFormattedDateTime(appSnapshot.data().appliedDateTime)}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                <BadgeStatus status={appSnapshot.data().status} />
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                {appSnapshot.data().admin ? appSnapshot.data().admin.name : null}
              </TableCell>
              <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                <Stack direction="row">
                  <Button size="small" onClick={() => onReviewClicked(appSnapshot.id)}>
                    Review
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

export default NpoApplicationsPage;
