// material
import {
  Card,
  Stack,
  Avatar,
  Autocomplete,
  Button,
  Collapse,
  Alert,
  Container,
  Typography,
  Slider,
} from '@mui/material';
// components
import { useNavigate, useLocation } from 'react-router-dom';
import { ImagePicker } from 'react-file-picker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { sliderAdd } from 'src/services/sliderServices.js';
import Page from '../../components/Page';

var options = ['Slider1', 'Slider2', 'Slider3'];

export default function AddSlider() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [lineData, setLineData] = useState('');
  const [inputTypeValue, setInputTypeValue] = useState('');
  const [id_add, setId_add] = useState('');
  const [name_add, setName_add] = useState('');
  const [type_add, setType_add] = useState('');
  const [status_add, setStatus_add] = useState('');
  const [selectedValue1, setSelectedValue1] = useState(lineData.status);

  const [images, setImages] = useState('');
  const [state, setState] = useState({
    name: false,
    image: false,
    type: false,
    created: false,
    status: false,
    type_Add: false,
  });
  // ----------------------------------------------------------------------

  const submitQA = async () => {
    if (name_add.trim() === '') {
      setState({ ...state, name: true });
      return;
    } else if (type_add.trim() === '') {
      setState({ ...state, type_Add: true });
      return;
    } else if (images.trim() === '') {
      setState({ ...state, images: true });
      return;
    }
    const body = {
      name: name_add,
      type: type_add,
      image: images,
      status: selectedValue1,
    };
    console.log(body);
    const res = await sliderAdd(body);
    console.log(res);
    if (res.statusCode === 200) {
      setOpen(false);
      setId_add('');
      setName_add('');
      setType_add('');
      setImages('');
      setStatus_add('');
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
        navigate('/dashboard/sliderManager', { state: { message: 'Slider Added Successfully' } });
      }, 1000);
    }
  };

  return (
    <Page title="Dashboard:Add Slider">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Slider
          </Typography>
        </Stack>
        <Collapse in={openAlert}>
          <Alert aria-hidden={true} severity="success">
            Slider Added Successfully
          </Alert>
        </Collapse>
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
              label="Slider Name"
              id="outlined-name"
              sx={{ flex: 1, m: 1 }}
            />
            <Autocomplete
              require
              value={type_add}
              onChange={(event, newValue) => {
                setType_add(newValue);
                setState({ ...state, type_Add: false });
              }}
              inputValue={inputTypeValue}
              onInputChange={(event, newInputValue) => {
                setInputTypeValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={options}
              sx={{ width: 450, margin: 2 }}
              renderInput={(params) => <TextField error={state.type_Add} {...params} label="Type" />}
            />
          </Stack>

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
            <Button
              variant="contained"
              onClick={() => {
                navigate('/dashboard/sliderManager');
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
