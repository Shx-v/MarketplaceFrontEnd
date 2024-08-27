import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { Button, Card, Divider, Fade, SvgIcon } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from 'src/contexts/auth/AuthContext';
import { Link } from 'react-router-dom';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open = false, ...other } = props;
  const { user, token, setUser, setToken, setIsLoggedIn } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.EncryptedResponse;
      console.log(data);
      if (data.success) {
        setUser(false);
        setToken(false);
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <Popover
      anchorEl={anchorEl}
      disableScrollLock
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { marginTop: 5, display: 'flex', flexDirection: 'column' } }}
      {...other}
    >
      <Box sx={{ p: 2, ml: 1 }}>
        {user && (
          <>
            <Typography variant="body1">{currentUser?.firstName}</Typography>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              {currentUser?.email}
            </Typography>
          </>
        )}
      </Box>
      <Divider sx={{ width: '100%' }} />
      {currentUser?.role === 'user' ? (
        <Box
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            marginLeft: '15px',
            gap: '8px',
          }}
        >
          <Link
            to="/account/services"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
              color: 'inherit',
            }}
          >
            <SvgIcon
              fontSize="small"
              color="primary"
            >
              <DesignServicesIcon />
            </SvgIcon>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              My Services
            </Typography>
          </Link>
          <Link
            to="/account/orders"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
              color: 'inherit',
            }}
          >
            <SvgIcon
              fontSize="small"
              color="primary"
            >
              <ShoppingCartIcon />
            </SvgIcon>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              My Orders
            </Typography>
          </Link>
          <Link
            to="/account/subscriptions"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
              color: 'inherit',
            }}
          >
            <SvgIcon
              fontSize="small"
              color="primary"
            >
              <ReceiptIcon />
            </SvgIcon>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              My Subscriptions
            </Typography>
          </Link>
        </Box>
      ) : (
        <Box
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            marginLeft: '15px',
            gap: '8px',
          }}
        >
          <Link
            to="/admin/orders"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
              color: 'inherit',
            }}
          >
            <SvgIcon
              fontSize="small"
              color="primary"
            >
              <ShoppingCartIcon />
            </SvgIcon>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              Orders
            </Typography>
          </Link>
          <Link
            to="/admin/subscriptions"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
              color: 'inherit',
            }}
          >
            <SvgIcon
              fontSize="small"
              color="primary"
            >
              <ReceiptIcon />
            </SvgIcon>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              Subscriptions
            </Typography>
          </Link>
        </Box>
      )}
      <Divider sx={{ width: '100%' }} />
      <Box
        sx={{
          display: 'flex',
          p: 1,
          justifyContent: 'center',
        }}
      >
        <Button
          color="inherit"
          onClick={handleLogout}
          size="small"
        >
          Logout
        </Button>
      </Box>
    </Popover>
  );
};
