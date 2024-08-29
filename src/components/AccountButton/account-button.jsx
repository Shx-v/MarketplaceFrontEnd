import { useState, useEffect } from 'react';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import Tooltip from '@mui/material/Tooltip';
import { usePopover } from '../../hooks/use-popover';
import { AccountPopover } from './account-popover';
import { Avatar, Box, SvgIcon } from '@mui/material';
import { Stack } from '@mui/system';

export const AccountButton = () => {
  const popover = usePopover();

  return (
    <>
      <Tooltip title="Account" sx={{zIndex: 1000}}>
        <Stack
          sx={{ marginRight: '10px' }}
          direction={'row'}
          ref={popover.anchorRef}
          onClick={popover.handleOpen}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'divider',
              height: 30,
              width: 30,
              borderRadius: '50%',
            }}
          >
            <Avatar
              sx={{
                height: 30,
                width: 30,
              }}
            >
              <SvgIcon style={{ width: '20px', height: '20px' }}>
                <User01Icon />
              </SvgIcon>
            </Avatar>
          </Box>
        </Stack>
      </Tooltip>
      <AccountPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
