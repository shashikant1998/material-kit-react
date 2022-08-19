// material
import { Card, Stack, Avatar, Button, Box, Radio, Container, Typography } from '@mui/material';
// components
import { useNavigate, useLocation } from 'react-router-dom';
import { ImagePicker } from 'react-file-picker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { roleUpdate } from '../../services/roleServices';
import { Alert } from '@mui/material';
import Collapse from '@mui/material/Collapse';

import Page from '../../components/Page';

var options = [];

export default function EditRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lineData } = location.state;
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [id_add, setId_add] = useState(lineData.id);
  const [name_add, setName_add] = useState(lineData.name);
  const [created_add, setCreated_add] = useState(lineData.created);

  const [status_add, setStatus_add] = useState(lineData.status);

  const [selectedValue, setSelectedValue] = useState(lineData.gender);
  const [selectedValue1, setSelectedValue1] = useState(lineData.status);

  const [images, setImages] = useState(lineData.image);
  const [state, setState] = useState({
    name: false,
    created: false,

    status: false,
  });
  // ----------------------------------------------------------------------
  console.log('hii', location.state);
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleChange1 = (event) => {
    setSelectedValue1(event.target.value);
  };
  useEffect(() => {}, []);

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
      // navigate('/dashboard/roleManager',{state:{message: }});
    }
  };
  console.log('data ', selectedValue1);
  return (
    <Page title="Dashboard:Edit Role ">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Edit Role
          </Typography>
        </Stack>

        <Collapse in={openAlert}>
          <Alert aria-hidden={true} severity="success">
            Role Update Successfully
          </Alert>
        </Collapse>
        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
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
              sx={{ flex: 1, m: 1 }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-evenly" mb={5} sx={{ margin: 2 }}></Stack>

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
              Update
            </Button>
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
