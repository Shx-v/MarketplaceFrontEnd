// src/pages/MyServices/MyServices.js
import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Stack,
  TablePagination,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { AuthContext } from 'src/contexts/auth/AuthContext';

const Orders = () => {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createSubscription = async (order) => {
    console.log(order);
    const apiData = {
      user: order.user,
      service: order.service,
      amount: order.amount,
    };
    console.log(apiData);
    try {
      const response = await axios.post('https://marketplacebackend-5jv3.onrender.com/api/v1/subscriptions', apiData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('response');
      const data = response.data.EncryptedResponse;
      console.log(data);
      if (data.success) {
        console.log('Subscription created successfully:', data.data);
      } else {
        console.error('Failed to create subscription:', data.message);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handleCancelOrder = async (id) => {
    if (user) {
      try {
        await axios.put(
          `https://marketplacebackend-5jv3.onrender.com/api/v1/orders/${id}`,
          { status: 'cancelled' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        handleGetOrders();
      } catch (error) {
        console.error('Error canceling order:', error);
      }
    }
  };

  const handleConfirmOrder = async (id, order) => {
    console.log(order);
    if (user) {
      try {
        await axios.put(
          `https://marketplacebackend-5jv3.onrender.com/api/v1/orders/${id}`,
          { status: 'completed' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('before');
        createSubscription(order);
        console.log('after');
        handleGetOrders();
      } catch (error) {
        console.error('Error confirming order:', error);
      }
    }
  };

  const handleGetOrders = async () => {
    if (user) {
      try {
        const response = await axios.get(`https://marketplacebackend-5jv3.onrender.com/api/v1/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.EncryptedResponse;
        setOrders(data.data.order);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
  };

  const handleDeleteOrder = async (id) => {
    if (user) {
      try {
        const response = await axios.delete(`https://marketplacebackend-5jv3.onrender.com/api/v1/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        handleGetOrders();
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
  };

  useEffect(() => {
    handleGetOrders();
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
          Orders
        </Typography>
      </Box>
      {orders.length === 0 ? (
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
                <TableCell>Paid</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.service.name}</TableCell>
                    <TableCell>₹{order.amount}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell align="right">
                      {order.status == 'Pending' && (
                        <IconButton
                          aria-label="cancel"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          <CancelIcon color="error" />
                        </IconButton>
                      )}
                      {order.status == 'Pending' && (
                        <IconButton
                          aria-label="confirm"
                          onClick={() => handleConfirmOrder(order._id, order)}
                        >
                          <CheckIcon color="success" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}
    </Container>
  );
};

export default Orders;
