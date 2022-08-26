import { ViewALL, CREATE, UPDATE, DELETE, STATUS } from '../constants/actionTypes';

import * as api from '../api/index';

export const getSliders = () => async (dispatch) => {
  try {
    const { data } = await api.fetchSliders();

    dispatch({ type: ViewALL, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const createSlider = (slider) => async (dispatch) => {
  try {
    const { data } = await api.createSlider(slider);

    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateSlider = (id, slider) => async (dispatch) => {
  try {
    const { data } = await api.updateSlider(id, slider);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const statusUpdate = (id) => async (dispatch) => {
  try {
    const { data } = await api.statusUpdate(id);

    dispatch({ type: STATUS, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteSlider = (id) => async (dispatch) => {
  try {
    await api.deleteSlider(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};
