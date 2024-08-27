import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Rating } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from 'src/contexts/auth/AuthContext';
import SubscriptionOrderModal from './Modals/SubscriptionOrderModal';

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, isLoggedIn } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [service, setService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

  const handleGetUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.EncryptedResponse;
      setCurrentUser(data.data.user);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleGetService = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.EncryptedResponse;
      setService(data.data.service);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    handleGetService();
  }, []);

  useEffect(() => {
    if (service?.provider) {
      handleGetUser(service?.provider);
    }
  }, [service]);
  return (
    <Container sx={{ pt: 10, pb: 8 }}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <Box
            component="img"
            src={'https://via.placeholder.com/140'}
            alt={service?.name}
            sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
          >
            {service?.name}
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            gutterBottom
          >
            {service?.category} by {currentUser?.firstName}
          </Typography>
          <Rating
            value={service?.rating ?? 0}
            precision={0.5}
            readOnly
          />
          <Typography
            variant="h5"
            sx={{ mt: 2 }}
          >
            {service?.price}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 4 }}
          >
            {service?.description}
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 4 }}
          >
            Features:
          </Typography>
          <ul>
            {service?.features.map((feature, index) => (
              <li key={index}>
                <Typography variant="body1">{feature}</Typography>
              </li>
            ))}
          </ul>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => {
              if (isLoggedIn) {
                handleOpen();
              } else {
                navigate('/auth/login');
              }
            }}
          >
            Subscribe Now
          </Button>
        </Grid>
      </Grid>
      <SubscriptionOrderModal
        open={isDialogOpen}
        handleClose={handleClose}
        service={service}
      />
    </Container>
  );
};

export default ServiceDetail;
