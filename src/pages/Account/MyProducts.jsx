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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { AuthContext } from 'src/contexts/auth/AuthContext';
import CreateServiceModal from '../Products/Modals/CreateServiceModal';

const MyServices = () => {
  const { user, token } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
    handleGetServices();
  };

  const handleGetServices = async () => {
    if (user) {
      try {
        const response = await axios.get(`https://marketplacebackend-5jv3.onrender.com/api/v1/services/prov/${user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.EncryptedResponse;
        setServices(data.data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
  };

  useEffect(() => {
    handleGetServices();
  }, []);

  const handleEdit = (service) => {
    setSelectedService(service);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (user) {
      try {
        const response = await axios.delete(`https://marketplacebackend-5jv3.onrender.com/api/v1/services/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        handleGetServices();
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
  };

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
          My Services
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          Create New Service
        </Button>
      </Box>
      {services.length == 0 ? (
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
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>₹{service.price}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(service)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(service._id)}
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
            count={services.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}

      {/* {selectedService != null && ( */}
        <CreateServiceModal
          open={open}
          onClose={handleClose}
          selectedService={selectedService}
        />
      {/* )} */}
    </Container>
  );
};

export default MyServices;
