import { filter } from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
import { roleUpdate } from '../../services/roleServices';
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

export default function RoleEdit() {
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
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open1, setOpen1] = useState(false);
  const [allSeceted, setAllSelected] = useState([]);
  const [array, setArray] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [images, setImages] = useState('');
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
    const viewAll = await roleView();

    for (var i = 0; i < viewAll.data.length; ++i) {
      var obj = {
        _id: viewAll.data[i]._id,
        // id: viewAll.data[i].id,
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
      status: selectedValue1,
    };
    const res = await roleUpdate(body);
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

        navigate('/dashboard/roleManager');
      }, 1000);
    }
    <Collapse in={openAlert}>
      <Alert aria-hidden={true} severity="success">
        Role Update Successfully
      </Alert>
    </Collapse>;
  };

  //   const headerKeys = Object.keys(Object.assign({}, ...array));

  const handleClickOpen1 = async () => {
    const res = await roleEdit(user_id);
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
        const res = await roleDelete(m);
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
    <Page title="Dashboard:Role Manager">
      <Container maxWidth="100%">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Role Manager
          </Typography>

          <TextField
            value={name_add}
            required
            error={state.name}
            onChange={(e) => {
              setName_add(e.target.value);
              setState({ ...state, name: false });
            }}
            label="Role"
            id="outlined-name"
            sx={{ flex: 1, m: 5 }}
          />

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
            <Stack sx={{ margin: 2 }}>
              {' '}
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/dashboard/roleManager');
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
            Role Update Successfully
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
                        {/* <TableCell align="left">{id}</TableCell> */}

                        {/* <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={image} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell> */}
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="left">{date.toString()}</TableCell>
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
                        {/* <TableCell align="left" onClick={statusChange}>
                          <Label variant="ghost" color={(status === 'Inactive' && 'error') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <UserMoreMenu
                            onDeleteButtonPress={async () => {
                              const res = await roleDelete(_id);
                              ViewAll(res);
                            }}
                            onEditButtonPress={() => {
                              navigate('/dashboard/editRole', {
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
              navigate('/dashboard/roleManager', {
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
              const res = await roleDelete(user_id);
              ViewAll(res);
            }}
          />
        </MenuItem>
      </Menu>
    </Page>
  );
}
