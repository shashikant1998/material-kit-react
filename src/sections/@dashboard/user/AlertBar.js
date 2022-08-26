import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

AlertBar.propTypes = {
  type: PropTypes.string,
  isMessageVisible: PropTypes.bool,
  message: PropTypes.string,
};
export default function AlertBar({ type, isMessageVisible, message }) {
  return (
    isMessageVisible && (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity={type}>{message}</Alert>
      </Stack>
    )
  );
}
