import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  IconButton,
  Stack,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { AuthContext } from 'src/contexts/auth/AuthContext';

const MySubscriptions = () => {
  const { token, user } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleGetSubscriptions = async () => {
    if (user) {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.EncryptedResponse;
        setSubscriptions(data.data.subscription);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
  };

  useEffect(() => {
    handleGetSubscriptions();
  }, []);

  return (
    <Container sx={{ pt: 15, pb: 8 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          component="h1"
        >
          Subscriptions
        </Typography>
      </Box>
      {subscriptions.length == 0 ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{
            height: '100%',
            textAlign: 'center',
            borderRadius: 2,
            p: 3,
            boxShadow: 1,
          }}
        >
          <Box>
            <InfoIcon
              color="primary"
              fontSize="large"
            />
          </Box>
          <Typography
            variant="h6"
            color="textSecondary"
          >
            No data available
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
          >
            Please check back later.
          </Typography>
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell align='right'>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription._id}>
                  <TableCell>{subscription.service.name}</TableCell>
                  <TableCell>{formatDate(subscription.startDate)}</TableCell>
                  <TableCell>{formatDate(subscription.endDate)}</TableCell>
                  <TableCell align='right'>{subscription.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MySubscriptions;
