import { filter } from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Switch } from '@mui/material';

// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Menu,
} from '@mui/material';
// components
import TextField from '@mui/material/TextField';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user';
import { roleAdd } from '../../services/roleServices';
import { roleDelete, roleView, roleEdit, RoleStatus } from '../../services/roleServices';
import Collapse from '@mui/material/Collapse';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Role Name', alignRight: false },
  { id: 'created', label: 'Created', alignRight: false },
  { id: 'status', label: 'status', alignRight: false },

  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function RoleManager() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [user_id, setUser_id] = useState('');
  const [lineData, setLineData] = useState('');
  const [roleList, setRoleList] = useState([]);
  const [open, setOpen] = useState(false);
  const [created_add, setCreated_add] = useState('');
  const [status_add, setStatus_add] = useState('');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('created');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open1, setOpen1] = useState(false);
  const [allSeceted, setAllSelected] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [openAlert1, setOpenAlert1] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedValue1, setSelectedValue1] = useState(lineData.status);
  const [state, setState] = useState({
    name: false,
    created: false,
    status: false,
  });
  const [name_add, setName_add] = useState('');

  useEffect(() => {
    ViewAll();
  }, []);
  const handleClickDeleteOpen = () => {
    console.log(user_id);
    setOpenDelete(true);
  };

  const ViewAll = async () => {
    var data = [];
    const viewAll = await roleView();

    for (var i = 0; i < viewAll.data.length; ++i) {
      var obj = {
        _id: viewAll.data[i]._id,
        name: viewAll.data[i].name,
        created: viewAll.data[i].created,
        status: viewAll.data[i].status,
      };

      data.push(obj);
    }
    setSelected([]);
    setRoleList(data);
  };

  // const handleClickOpenAlert = () => {
  //   setOpenAlert(true);
  // };

  const submitQA = async () => {
    if (name_add.trim() === '') {
      setState({ ...state, name: true });
      return;
    }

    const body = {
      name: name_add,
      status: selectedValue1,
    };
    console.log(body);
    const res = await roleAdd(body);
    if (res.statusCode === 200) {
      //console.log('hii', res.data);
      setOpen(false);
      setName_add('');
      setCreated_add('');
      setStatus_add('');
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 3000);
    }
    ViewAll();
  };

  const handleClickOpen = async () => {
    const res = await roleEdit(user_id);
    setOpen1(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'desc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = roleList.map((n) => n._id);
      const newCollected = roleList.map((n) => n);
      setAllSelected(newCollected);
      setSelected(newSelecteds);
      return;
    }
    setAllSelected([]);
    setSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row._id);
    console.log(row._id, row);
    let newSelected = [];
    let newAllSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row._id);
      newAllSelected = newAllSelected.concat(allSeceted, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newAllSelected = newAllSelected.concat(allSeceted.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newAllSelected = newAllSelected.concat(allSeceted.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      newAllSelected = newAllSelected.concat(allSeceted.slice(0, selectedIndex), allSeceted.slice(selectedIndex + 1));
    }
    setAllSelected(newAllSelected);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  // const DeleteRole = async () => {
  //   const res = await roleDelete(_id);
  //   setOpenAlert1(true);
  //   setTimeout(() => {
  //     setOpenAlert1(false);
  //   }, 3000);
  //   ViewAll(res);
  // };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roleList.length) : 0;

  // const filteredUsers = applySortFilter(roleList, getComparator(order, orderBy), filterName);
  const filteredUsers = applySortFilter(roleList, getComparator(order, orderBy), filterName);
  filteredUsers.reverse();
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Dashboard:Role Manager">
      <Container maxWidth="100%">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Role Manager
          </Typography>

          <TextField
            required
            error={state.name}
            value={name_add}
            onChange={(e) => {
              setName_add(e.target.value);
              setState({ ...state, name: false });
            }}
            label="Role"
            id="outlined-name"
            sx={{ flex: 1, m: 5 }}
          />
          <Button variant="contained" onClick={submitQA}>
            Add
          </Button>
        </Stack>
        <Collapse in={openAlert}>
          <Alert aria-hidden={true} severity="success">
            Role Added Successfully
          </Alert>
        </Collapse>
        <Collapse in={openAlert1}>
          <Alert aria-hidden={true} severity="success">
            Role Delete Successfully
          </Alert>
        </Collapse>

        <Card sx={{ maxWidth: '100%' }}>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            exportData={allSeceted}
            onFilterName={handleFilterByName}
            list={selected}
            refresh={ViewAll}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 500, maxWidth: '100%' }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredUsers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, _id, name, created, status } = row;
                    const isItemSelected = selected.indexOf(_id) !== -1;
                    // var date = created.format('DD/MM/YYYY');
                    var d = new Date(created);
                    var date = d.getDate();
                    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
                    var year = d.getFullYear();
                    var newDate = date + '-' + month + '-' + year;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row)} />
                        </TableCell>

                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="left">{newDate}</TableCell>
                        <TableCell align="left">
                          <Switch
                            checked={status}
                            onChange={async (e) => {
                              const body = { _id: _id, status: !status };
                              var res = await RoleStatus(body);
                              await ViewAll();
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            onDeleteButtonPress={async () => {
                              const res = await roleDelete(_id);
                              setOpenAlert1(true);
                              setTimeout(() => {
                                setOpenAlert1(false);
                              }, 3000);
                              ViewAll(res);
                            }}
                            onEditButtonPress={() => {
                              navigate('/dashboard/roleEdit', {
                                state: { lineData: row },
                              });
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
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
        {/* <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon onClick={handleClickOpen}>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            onClick={() => {
              navigate('/dashboard/roleEdit', {
                state: { lineData },
              });
            }}
            primary="Edit"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem> */}
        {/* <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon onClick={handleClickDeleteOpen}>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: 'body2' }}
            onClick={async (e) => {
              const res = await roleDelete(user_id);
              ViewAll(res);
            }}
          />
          <Dialog open={openDelete} onClose={handleCloseDelete}>
            <DialogTitle>Are you sure you want to Delete ?</DialogTitle>

            <DialogActions>
              <Button onClick={handleCloseDelete}>No</Button>
              <Button onClick={DeleteRole}>Yes</Button>
            </DialogActions>
          </Dialog>
        </MenuItem> */}
      </Menu>
    </Page>
  );
}

// const RootStyle = styled(Toolbar)(({ theme }) => ({
//   height: 96,
//   display: 'flex',
//   justifyContent: 'space-between',
//   padding: theme.spacing(0, 1, 0, 3),
// }));

// const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
//   width: 240,
//   transition: theme.transitions.create(['box-shadow', 'width'], {
//     easing: theme.transitions.easing.easeInOut,
//     duration: theme.transitions.duration.shorter,
//   }),
//   '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
//   '& fieldset': {
//     borderWidth: `1px !important`,
//     borderColor: `${theme.palette.grey[500_32]} !important`,
//   },
// }));

// ----------------------------------------------------------------------

// UserListToolbar.propTypes = {
//   numSelected: PropTypes.number,
//   filterName: PropTypes.string,
//   onFilterName: PropTypes.func,
//   refresh: PropTypes.func,
// };

// function UserListToolbar({ numSelected, filterName, onFilterName, list, refresh }) {
//   const [openAlert, setOpenAlert] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);

//   const handleClickDeleteOpen = () => {
//     console.log(list);

//     setOpenDelete(true);
//   };

//   const handleCloseDelete = () => {
//     setOpenDelete(false);
//   };

//   const deleteAPI = async () => {
//     for (var i = 0; i < list.length; ++i) {
//       var res = await roleDelete(list[i]);
//       console.log(res.data);
//       setOpenAlert(true);
//       setTimeout(() => {
//         setOpenAlert(false);
//       }, 3000);
//     }

//     setOpenDelete(false);
//     await refresh();
//   };
//   return (
//     <RootStyle
//       sx={{
//         ...(numSelected > 0 && {
//           color: 'primary.main',
//           bgcolor: 'primary.lighter',
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography component="div" variant="subtitle1">
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <SearchStyle
//           value={filterName}
//           onChange={onFilterName}
//           placeholder="Search Role..."
//           startAdornment={
//             <InputAdornment position="start">
//               <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
//             </InputAdornment>
//           }
//         />
//       )}
//       <Collapse in={openAlert}>
//         <Alert aria-hidden={true} severity="success">
//           Role Delete Successfully
//         </Alert>
//       </Collapse>
//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton onClick={handleClickDeleteOpen}>
//             <Iconify icon="eva:trash-2-fill" />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title="Filter list">
//           <IconButton>
//             <Iconify icon="ic:round-filter-list" />
//           </IconButton>
//         </Tooltip>
//       )}

//       <Dialog open={openDelete} onClose={handleCloseDelete}>
//         <DialogTitle>Are you sure you want to Delete ?</DialogTitle>

//         <DialogActions>
//           <Button onClick={handleCloseDelete}>No</Button>
//           <Button onClick={deleteAPI}>Yes</Button>
//         </DialogActions>
//       </Dialog>
//     </RootStyle>
//   );
// }
