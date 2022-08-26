import { filter } from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Collapse,
  Alert,
  Table,
  Stack,
  Avatar,
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
  MenuItem,
  Switch,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
// components
import Page from '../../components/Page';
// import Label from '../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserMoreMenu, SliderListToolbar } from '../../sections/@dashboard/user';
import { sliderDelete, sliderView, sliderEdit, sliderStatus } from 'src/services/sliderServices';
import AlertBar from '../../sections/@dashboard/user/AlertBar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'image', label: 'Image', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'created', label: 'Created', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },

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

export default function SliderManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [user_id, setUser_id] = useState('');
  const [lineData, setLineData] = useState('');
  const [sliderList, setSliderList] = useState([]);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('created');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open1, setOpen1] = useState(false);
  const [allSeceted, setAllSelected] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [openAlert1, setOpenAlert1] = useState(false);
  useEffect(() => {
    ViewAll();
  }, []);

  async function ViewAll() {
    var data = [];
    const viewAll = await sliderView();

    for (var i = 0; i < viewAll.data.length; ++i) {
      var obj = {
        id: i,
        _id: viewAll.data[i]._id,
        name: viewAll.data[i].name,
        image: viewAll.data[i].image,
        type: viewAll.data[i].type,
        created: viewAll.data[i].created,
        status: viewAll.data[i].status,
      };

      data.push(obj);
    }
    setSelected([]);
    setSliderList(data);
  }

  const handleClickOpen1 = async () => {
    const res = await sliderEdit(user_id);
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sliderList.map((n) => n._id);
      const newCollected = sliderList.map((n) => n);
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

  const handleDeleteButtonPress = async () => {
    try {
      selected.map(async (m) => {
        const res = await sliderDelete(m);
        ViewAll(res);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sliderList.length) : 0;

  const filteredUsers = applySortFilter(sliderList, getComparator(order, orderBy), filterName);
  filteredUsers.reverse();
  const isUserNotFound = filteredUsers.length === 0;

  console.log('after data added', location.state);

  return (
    <Page title="Dashboard:Slider Manager">
      <Container maxWidth="100%">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Slider Manager
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/dashboard/addSlider');
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Slider
          </Button>
        </Stack>
        {/* <AlertBar 
          type
          isMessageVisible
          message
        /> */}
        <Collapse in={openAlert}>
          <Alert aria-hidden={true} severity="success">
            Slider Added Successfully
          </Alert>
        </Collapse>
        <Collapse in={openAlert1}>
          <Alert aria-hidden={true} severity="success">
            Slider Delete Successfully
          </Alert>
        </Collapse>
        <Card sx={{ maxWidth: '100%' }}>
          <SliderListToolbar
            numSelected={selected.length}
            filterName={filterName}
            exportData={allSeceted}
            onFilterName={handleFilterByName}
            list={selected}
            refresh={ViewAll}
            onDeleteButtonPress={handleDeleteButtonPress}
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
                    const { id, _id, image, name, type, status, created } = row;
                    const isItemSelected = selected.indexOf(_id) !== -1;

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
                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar variant="square" src={image} />
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{type}</TableCell>
                        <TableCell align="left">{newDate}</TableCell>

                        <TableCell align="left">
                          <Switch
                            checked={status}
                            onChange={async (e) => {
                              const body = { _id: _id, status: !status };
                              var res = await sliderStatus(body);
                              await ViewAll();
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            onDeleteButtonPress={async () => {
                              const res = await sliderDelete(_id);
                              setOpenAlert1(true);
                              setTimeout(() => {
                                setOpenAlert1(false);
                              }, 3000);
                              ViewAll(res);
                            }}
                            onEditButtonPress={() => {
                              navigate('/dashboard/editSlider', {
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
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            onClick={() => {
              navigate('/dashboard/editSlider', {
                state: { lineData },
              });
            }}
            primary="Edit"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: 'body2' }}
            onClick={async (e) => {
              const res = await sliderDelete(user_id);
              ViewAll(res);
            }}
          />
        </MenuItem>
      </Menu>
    </Page>
  );
}
