import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDeleteButtonPress: PropTypes.func,
  onEditButtonPress: PropTypes.func,
};

export default function UserMoreMenu({ onDeleteButtonPress, onEditButtonPress }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const deleteAPI = async () => {
    setOpenDelete(false);
    onDeleteButtonPress();
  };
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickDeleteOpen}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={onEditButtonPress}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Are you sure you want to Delete ?</DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDelete}>No</Button>
          <Button onClick={deleteAPI}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
