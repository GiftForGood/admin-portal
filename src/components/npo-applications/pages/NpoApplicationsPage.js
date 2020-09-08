import React, { useState, useEffect } from 'react';
import { Stack, Button } from '@kiwicom/orbit-components/';
import Table, { TableHead, TableBody, TableRow, TableCell } from '@kiwicom/orbit-components/lib/Table';
import api from '../../../../api';
import { getFormattedDateTime } from '../../../../utils/time/time';
import { useRouter } from 'next/router';
import BadgeStatus from '../modules/BadgeStatus';
import Filter from '../modules/Filter';
import { ORDER_BY } from '../../../../utils/constants/npoVerification';
import { deserializeFirestoreTimestampToUnixTimestamp } from '../../../../utils/firebase/deserializer';

const NpoApplicationsPage = () => {
  const [filterStatus, setFilterStatus] = useState();
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  const getAllApplications = async () => {
    try {
      let lastQueriedDocument = null;
      if (applications.length > 0) {
        lastQueriedDocument = applications[applications.length - 1];
      }

      const appSnapshots = await api.npoVerifications.getAll(
        filterStatus,
        ORDER_BY.LAST_UPDATED_DATE,
        false,
        lastQueriedDocument
      );
      setApplications([...applications, ...appSnapshots]);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllApplicationsForStatus = async () => {
    try {
      const appSnapshots = await api.npoVerifications.getAll(filterStatus);
      setApplications(appSnapshots);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllApplicationsForStatus();
  }, [filterStatus]);

  const onSelectedFilter = (status) => {
    setFilterStatus(status);
  };

  const onReviewClicked = (npoApplicationId) => {
    router.push(`/npo-applications/${npoApplicationId}`);
  };

  const onLoadMoreclicked = async () => {
    getAllApplications();
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
          {applications.map((appSnapshot, index) => {
            const data = appSnapshot.data();
            deserializeFirestoreTimestampToUnixTimestamp(data);
            const { organization, name, appliedDateTime, status, admin } = data;
            return (
              <TableRow>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {index + 1}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {organization.name}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {name}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {getFormattedDateTime(appliedDateTime)}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  <BadgeStatus status={status} />
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  {admin ? admin.name : null}
                </TableCell>
                <TableCell align="center" verticalAlign="baseline" whiteSpace="nowrap">
                  <Stack direction="row">
                    <Button size="small" onClick={() => onReviewClicked(appSnapshot.id)}>
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

export default NpoApplicationsPage;
