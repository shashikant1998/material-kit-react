import { Alert, Snackbar } from '@mui/material';
import React from 'react';

export default function Notification(props) {
  const { notify, setNotify } = props;
  return (
    <Snackbar open={notify.isOpen} autoHideDuration={3000}>
      <Alert severity={notify.type}>{notify.message}</Alert>
    </Snackbar>
  );
}
