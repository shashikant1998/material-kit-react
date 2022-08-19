// material
import { Card, Stack, Avatar, Button, Box, Radio, Container, Typography } from '@mui/material';
// components
import { useNavigate, Link } from 'react-router-dom';
import { ImagePicker } from 'react-file-picker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TextField from '@mui/material/TextField';
import Iconify from '../../components/Iconify';
import validator from 'validator';
import { useEffect, useState } from 'react';
import { roleAdd } from '../../services/roleServices';
// import { Notification } from '../../components/Notification';
import Page from '../../components/Page';
import { id } from 'date-fns/locale';
var options = [];
export default function AddRole() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [id_add, setId_add] = useState('');
  const [name_add, setName_add] = useState('');
  const [created_add, setCreated_add] = useState('');
  const [status_add, setStatus_add] = useState('');
  const [selectedValue1, setSelectedValue1] = useState('Active');
  const [images, setImages] = useState('');
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [state, setState] = useState({
    name: false,
    created: false,
    status: false,
  });

  // ----------------------------------------------------------------------

  const handleChange1 = (event) => {
    setSelectedValue1(event.target.value);
  };

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
    console.log(res);
    if (res.data.statusCode === 200) {
      setOpen(false);
      setName_add('');
      setCreated_add('');
      setStatus_add('');
      setImages('');
      // setNotify({
      //   isOpen: true,
      //   message: 'Submitted Successfully',
      //   type: 'success',
      // });

      setOpenAlert(true);
      <Link to="/dashboard/roleManager"></Link>;
      navigate('/dashboard/roleManager');
    }
  };

  return (
    <Page title="Dashboard:Add Role ">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Role
          </Typography>
        </Stack>

        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
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
              sx={{ flex: 1, m: 1 }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                navigate('/dashboard/roleManager');
              }}
            >
              Back
            </Button>
            <Button variant="contained" onClick={submitQA}>
              Submit
            </Button>

            {/* <Notification notify={notify} setNotify={setNotify} /> */}
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
