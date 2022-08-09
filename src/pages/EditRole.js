// material
import { Card, Stack, Avatar, Button, Box, Radio, Container, Typography } from '@mui/material';
// components
import { useNavigate, useLocation } from 'react-router-dom';
import { ImagePicker } from 'react-file-picker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { roleUpdate } from '../services/roleServices';

import Page from '../components/Page';

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
    image: false,
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
    } else if (created_add.trim() === '') {
      setState({ ...state, created: true });
      return;
    }
    const body = {
      _id: lineData._id,
      id: id_add,
      name: name_add,
      image: images,
      created: created_add,
      status: selectedValue1,
    };
    const res = await roleUpdate(body);
    if (res.statusCode === 200) {
      setOpen(false);
      setId_add('');
      setName_add('');

      setStatus_add('');

      setCreated_add('');
      setImages('');

      setOpenAlert(true);
      navigate('/dashboard/roleManager');
    }
  };
  console.log('data ', selectedValue);
  return (
    <Page title="Dashboard:Edit Role ">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Edit Role
          </Typography>
        </Stack>

        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
            <TextField
              value={id_add}
              required
              error={state.name}
              onChange={(e) => {
                setId_add(e.target.value);
                setState({ ...state, id: false });
              }}
              label="Id"
              id="outlined-name"
              sx={{ flex: 1, m: 1 }}
            />
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
            <TextField
              value={created_add}
              required
              error={state.name}
              onChange={(e) => {
                setCreated_add(e.target.value);
                setState({ ...state, created: false });
              }}
              label="Created"
              id="outlined-name"
              sx={{ flex: 1, m: 1 }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-evenly" mb={5} sx={{ margin: 2 }}>
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ margin: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="subtitle1" noWrap>
                  Status
                </Typography>
                Active
                <Radio
                  checked={selectedValue1 === 'Active'}
                  onChange={handleChange1}
                  value="Active"
                  name="radio-buttons"
                  componentsProps={{ input: { 'aria-label': 'A' } }}
                />
                Inactive
                <Radio
                  checked={selectedValue1 === 'Inactive'}
                  onChange={handleChange1}
                  value="Inactive"
                  name="radio-buttons"
                  componentsProps={{ input: { 'aria-label': 'B' } }}
                />
              </Box>
            </Stack>
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
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
