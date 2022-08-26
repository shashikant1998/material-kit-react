import { filter } from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Alert, Switch } from '@mui/material';
import { ImagePicker } from 'react-file-picker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  Avatar,
  TableCell,
  Autocomplete,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
// components
import TextField from '@mui/material/TextField';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user';
import { categoryUpdate } from '../../services/categoryServices';
import { categoryDelete, categoryView, categoryEdit, CategoryStatus } from '../../services/categoryServices';
import Collapse from '@mui/material/Collapse';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Category Name', alignRight: false },
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
var options = ['Shoes', 'T-Shirt', 'Shirt', "Mobile's"];

export default function CategoryEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lineData } = location.state;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [user_id, setUser_id] = useState('');
  const [roleList, setRoleList] = useState([]);
  const [open, setOpen] = useState(false);
  const [created_add, setCreated_add] = useState('');
  const [status_add, setStatus_add] = useState('');
  const [name_update, setName_update] = useState('');
  const [course_update, setCourse_update] = useState('');
  const [email_update, setEmail_update] = useState('');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('created');
  const [filterName, setFilterName] = useState('');
  const [inputNameValue, setInputNameValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open1, setOpen1] = useState(false);
  const [allSeceted, setAllSelected] = useState([]);
  const [array, setArray] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [images, setImages] = useState(lineData.image);
  const [selectedValue1, setSelectedValue1] = useState(lineData.status);
  const [selectedValue, setSelectedValue] = useState(lineData.status);

  const [state, setState] = useState({
    name: false,
    created: false,
    status: false,
  });
  const [name_add, setName_add] = useState(lineData.name);

  useEffect(() => {
    ViewAll();
  }, []);

  const ViewAll = async () => {
    var data = [];
    const viewAll = await categoryView();

    for (var i = 0; i < viewAll.data.length; ++i) {
      var obj = {
        _id: viewAll.data[i]._id,

        name: viewAll.data[i].name,
        created: viewAll.data[i].created,
        status: viewAll.data[i].status,
        image: viewAll.data[i].image,
      };

      data.push(obj);
    }
    setSelected([]);
    setRoleList(data);
  };

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };
  console.log('hii', location.state);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleChange1 = (event) => {
    setSelectedValue1(event.target.value);
  };

  const submitQA = async () => {
    if (name_add.trim() === '') {
      setState({ ...state, name: true });
      return;
    }

    const body = {
      _id: lineData._id,
      name: name_add,
      image: images,
      status: selectedValue1,
    };
    const res = await categoryUpdate(body);
    if (res.statusCode === 200) {
      console.log('hii', res.data);
      setOpen(false);
      setName_add('');
      setStatus_add('');
      setCreated_add('');
      setImages('');

      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);

        navigate('/dashboard/categoryManager');
      }, 1000);
    }
    <Collapse in={openAlert}>
      <Alert aria-hidden={true} severity="success">
        Role Update Successfully
      </Alert>
    </Collapse>;
  };

  const handleClickOpen1 = async () => {
    const res = await categoryEdit(user_id);
    setName_update(res.data[0].name);
    setCourse_update(res.data[0].course);
    setEmail_update(res.data[0].email);

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

  const handleDeleteButtonPress = async () => {
    try {
      selected.map(async (m) => {
        const res = await categoryDelete(m);
        ViewAll(res);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roleList.length) : 0;

  const filteredUsers = applySortFilter(roleList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Dashboard:Category Manager">
      <Container maxWidth="100%">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Category Manager
          </Typography>

          <Autocomplete
            required
            value={name_add}
            onChange={(event, newValue) => {
              setName_add(newValue);
            }}
            inputValue={inputNameValue}
            onInputChange={(event, newInputValue) => {
              setInputNameValue(newInputValue);
            }}
            id="controllable-states-demo"
            options={options}
            sx={{ width: 450 }}
            renderInput={(params) => <TextField error={state.name} {...params} label="Category" />}
          />
          <Stack direction="row" alignItems="center" mb={5} sx={{ margin: 2 }}>
            <Avatar alt="images" src={images} sx={{ margin: 2 }} />
            <ImagePicker
              extensions={['jpg', 'jpeg', 'png']}
              dims={{
                minWidth: 100,
                maxWidth: 1340,
                minHeight: 100,
                maxHeight: 1040,
              }}
              onChange={(base64) => setImages(base64)}
              onError={(errMsg) => {
                console.log(errMsg);
              }}
            >
              <Button variant="outlined" startIcon={<PhotoCamera />}>
                Upload
              </Button>
            </ImagePicker>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
            <Stack sx={{ margin: 2 }}>
              {' '}
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/dashboard/categoryManager');
                }}
              >
                Back
              </Button>
            </Stack>
            <Button variant="contained" onClick={submitQA}>
              Update
            </Button>
          </Stack>
        </Stack>
        <Collapse in={openAlert}>
          <Alert aria-hidden={true} severity="success">
            Category Update Successfully
          </Alert>
        </Collapse>

        <Card sx={{ maxWidth: '100%' }}>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            exportData={allSeceted}
            onFilterName={handleFilterByName}
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
                    const { id, _id, image, name, created, status } = row;
                    const isItemSelected = selected.indexOf(_id) !== -1;
                    var date = new Date(created).toLocaleDateString('en-US');

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

                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={image} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{date.toString()}</TableCell>
                        <TableCell align="left">
                          <Switch
                            checked={status}
                            onChange={async (e) => {
                              const body = { _id: _id, status: !status };
                              var res = await CategoryStatus(body);
                              await ViewAll();
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            onDeleteButtonPress={async () => {
                              const res = await categoryDelete(_id);
                              ViewAll(res);
                            }}
                            onEditButtonPress={() => {
                              navigate('/dashboard/editCategory', {
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
          <ListItemIcon onClick={handleClickOpen1}>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            onClick={() => {
              navigate('/dashboard/categoryManager', {
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
              const res = await categoryDelete(user_id);
              ViewAll(res);
            }}
          />
        </MenuItem>
      </Menu>
    </Page>
  );
}
