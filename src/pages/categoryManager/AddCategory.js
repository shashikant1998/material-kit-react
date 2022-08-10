// material
import { Card, Stack, Avatar, Button, Box, Radio, Container, Typography } from '@mui/material';
// components
import { useNavigate } from 'react-router-dom';
import { ImagePicker } from 'react-file-picker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TextField from '@mui/material/TextField';
import Iconify from '../../components/Iconify';

import { useEffect, useState } from 'react';
import { categoryAdd } from '../../services/categoryServices';
import Page from '../../components/Page';
var options = [];
export default function AddCategory() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [id_add, setId_add] = useState('');
  const [name_add, setName_add] = useState('');
  const [created_add, setCreated_add] = useState('');
  const [status_add, setStatus_add] = useState('');
  const [selectedValue1, setSelectedValue1] = useState('Active');
  const [images, setImages] = useState('');
  const [state, setState] = useState({
    // id: false,
    name: false,
    created: false,
    status: false,
    image: false,
  });
  // ----------------------------------------------------------------------

  const handleChange1 = (event) => {
    setSelectedValue1(event.target.value);
  };

  const submitQA = async () => {
    if (name_add.trim() === '') {
      setState({ ...state, name: true });
      return;
    } else if (created_add.trim() === '') {
      setState({ ...state, created: true });
      return;
    }

    const body = {
      id: id_add,
      name: name_add,
      image: images,
      created: created_add,
      status: selectedValue1,
    };
    console.log(body);
    const res = await categoryAdd(body);
    console.log(res);
    if (res.data.statusCode === 200) {
      setOpen(false);
      setId_add('');
      setName_add('');
      setCreated_add('');
      setStatus_add('');
      setImages('');
      setOpenAlert(true);
      navigate('/dashboard/categoryManager');
    }
  };

  return (
    <Page title="Dashboard:Add Category">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Category
          </Typography>
        </Stack>

        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
            <TextField
              required
              error={state.name}
              value={id_add}
              onChange={(e) => {
                setId_add(e.target.value);
                setState({ ...state, id: false });
              }}
              label="Id"
              id="outlined-name"
              sx={{ flex: 1, m: 1 }}
            />
            <TextField
              required
              error={state.name}
              value={name_add}
              onChange={(e) => {
                setName_add(e.target.value);
                setState({ ...state, name: false });
              }}
              label="Category"
              id="outlined-name"
              sx={{ flex: 1, m: 1 }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} sx={{ margin: 2 }}>
            <TextField
              required
              error={state.name}
              value={created_add}
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
                <Typography
                  variant="subtitle1"
                  noWrap
                  value={status_add}
                  onChange={(e) => {
                    setStatus_add(e.target.value);
                  }}
                >
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
                navigate('/dashboard/categoryManager');
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
