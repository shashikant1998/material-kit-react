// material
import { Card, Stack, Avatar, Autocomplete, Button, Collapse, Alert, Container, Typography } from '@mui/material';
// components
import { useNavigate, useLocation } from 'react-router-dom';
import { ImagePicker } from 'react-file-picker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { sliderUpdate } from 'src/services/sliderServices.js';
import Page from '../../components/Page';
var options = ['Slider1', 'Slider2', 'Slider3'];

export default function EditStudent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lineData } = location.state;
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  // const [courseList, setCourseList] = useState(options[0]);
  //const [gender, setGender] = useState(options[0]);
  const [inputTypeValue, setInputTypeValue] = useState('');
  const [id_add, setId_add] = useState('');
  const [name_add, setName_add] = useState(lineData.name);
  const [status_add, setStatus_add] = useState(lineData.status);
  const [type_add, setType_add] = useState(lineData.type);
  const [images, setImages] = useState(lineData.image);
  const [selectedValue1, setSelectedValue1] = useState(lineData.status);
  const [state, setState] = useState({
    name: false,
    type: false,
    created: false,
    status: false,
    image: false,
  });
  // ----------------------------------------------------------------------
  console.log('hii', location.state);

  const submitQA = async () => {
    if (name_add.trim() === '') {
      setState({ ...state, name: true });
      return;
    } else if (images.trim() === '') {
      setState({ ...state, images: true });
      return;
    } else if (type_add.trim() === '') {
      setState({ ...state, type: true });
      return;
    }
    const body = {
      _id: lineData._id,
      name: name_add,
      image: images,
      type: type_add,
      status: selectedValue1,
    };
    const res = await sliderUpdate(body);
    if (res.statusCode === 200) {
      setOpen(false);
      setId_add('');
      setName_add('');
      setType_add('');
      setStatus_add('');
      setImages('');
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);

        navigate('/dashboard/sliderManager');
      }, 1000);
    }
  };
  return (
    <Page title="Dashboard:Edit Slider">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Edit Slider
          </Typography>
        </Stack>
        <Collapse in={openAlert}>
          <Alert aria-hidden={true} severity="success">
            Slider Update Successfully
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
              label="Slider Name"
              id="outlined-name"
              sx={{ flex: 1, m: 1 }}
            />
            <Autocomplete
              required
              value={type_add}
              onChange={(event, newValue) => {
                setType_add(newValue);
              }}
              inputValue={inputTypeValue}
              onInputChange={(event, newInputValue) => {
                setInputTypeValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={options}
              sx={{ width: 450, margin: 2 }}
              renderInput={(params) => <TextField error={state.name} {...params} label="Type" />}
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
