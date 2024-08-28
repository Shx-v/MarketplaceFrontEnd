import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Rating } from '@mui/material';
import axios from 'axios';
import { AuthContext } from 'src/contexts/auth/AuthContext';
import { useNavigate } from 'react-router';

const ProductCard = ({ service }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);

  const handleGetUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/users/${service.provider}`, {
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

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <Card
      sx={{ maxWidth: 345, m: 2, cursor: 'pointer', height: '100%' }}
      onClick={() => navigate(`${service._id}`)}
    >
      <CardMedia
        component="img"
        height="140"
        image={service.image}
        alt={service.name}
      />
      <CardContent>
        <Typography
          variant="h5"
          component="div"
        >
          {service.name}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Features: {service.features.join(', ')}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {`Provider: ${currentUser?.firstName} ${currentUser?.lastName}`}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Price: {service.price}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Category: {service.category}
        </Typography>
        <Rating
          value={service.averageRating}
          precision={0.5}
          readOnly
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
