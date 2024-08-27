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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    handleGetServices();
  };

  const handleGetServices = async () => {
    if (user) {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/services/prov/${user}`, {
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

  const handleEdit = (id) => {
    console.log(`Edit service with ID: ${id}`);
    // Implement your edit functionality here
  };

  const handleDelete = async (id) => {
    if (user) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/v1/services/${id}`, {
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
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>₹{service.price}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(service._id)}
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
        </TableContainer>
      )}

      <CreateServiceModal
        open={open}
        onClose={handleClose}
      />
    </Container>
  );
};

export default MyServices;
