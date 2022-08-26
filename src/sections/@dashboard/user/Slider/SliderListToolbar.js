import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  DialogActions,
  Button,
  DialogTitle,
  Dialog,
  Alert,
  Collapse,
} from '@mui/material';
// component
import { useState } from 'react';

import Iconify from '../../../../components/Iconify';
import { sliderDelete } from '../../../../services/sliderServices';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

//---------------------------------------------------------------------

// ----------------------------------------------------------------------

SliderListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  exportData: PropTypes.array,
  onFilterName: PropTypes.func,
  refresh: PropTypes.func,
  onExportLinkPress: PropTypes.func,
  onDeleteButtonPress: PropTypes.func,
};

export default function SliderListToolbar({
  numSelected,
  filterName,
  onFilterName,
  list,
  refresh,
  exportData,
  onExportLinkPress,
  onDeleteButtonPress,
}) {
  const [openAlert, setOpenAlert] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickDeleteOpen = () => {
    console.log(list);

    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const deleteAPI = async () => {
    for (var i = 0; i < list.length; ++i) {
      var res = await sliderDelete(list[i]);
      console.log(res.data);
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 3000);
    }
    setOpenDelete(false);
    await refresh();
  };
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search Slider..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}
      <Collapse in={openAlert}>
        <Alert aria-hidden={true} severity="success">
          Slider Delete Successfully
        </Alert>
      </Collapse>
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleClickDeleteOpen}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Are you sure you want to Delete ?</DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDelete}>No</Button>
          <Button onClick={deleteAPI}>Yes</Button>
        </DialogActions>
      </Dialog>
    </RootStyle>
  );
}
