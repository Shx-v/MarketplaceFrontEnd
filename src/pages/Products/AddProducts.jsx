import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert, MenuItem } from '@mui/material';
import axios from 'axios';
import { AuthContext } from 'src/contexts/auth/AuthContext';

const AddProducts = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [message, setMessage] = useState('');
  const { user, token } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);

  const handleGetUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/users/${user}`, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceData = {
      name,
      provider: currentUser,
      description,
      category,
      price: parseFloat(price),
      features: features.split(',').map((f) => f.trim()),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/services', serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(`Service created successfully: ${response.data.name}`);
    } catch (error) {
      console.error('Error creating service:', error);
      setMessage('Failed to create service.');
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 15 }}>
        <Typography
          variant="h4"
          gutterBottom
        >
          Create Service
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            required
            select
            margin="normal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value={'Project Management'}>Project Management</MenuItem>
            <MenuItem value={'CRM'}>Customer Relationship Management</MenuItem>
            <MenuItem value={'HR'}>Human Resource</MenuItem>
            <MenuItem value={'Marketing Automation'}>Marketing Automation</MenuItem>
            <MenuItem value={'Analytics and Business Intelligence'}>
              Analytics and Business Intelligence
            </MenuItem>
          </TextField>
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            label="Features (comma-separated)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Service
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddProducts;
