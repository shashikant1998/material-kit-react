const axios = require('axios');
const config = require('../config/config');
const slider = require('../config/sliderConfig');

module.exports.sliderAdd = async (body, url = config.protocol + config.hostname + ':' + config.port + slider.add) => {
  var res;
  try {
    res = await axios.post(url, body);
    console.log('hii', res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};

module.exports.sliderView = async (url = config.protocol + config.hostname + ':' + config.port + slider.view) => {
  var res;
  try {
    res = await axios.get(url);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};

module.exports.sliderEdit = async (_id, url = config.protocol + config.hostname + ':' + config.port + slider.edit) => {
  var res;
  try {
    res = await axios.get(url + _id);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};

module.exports.sliderDelete = async (
  _id,
  url = config.protocol + config.hostname + ':' + config.port + slider.delete
) => {
  var res;
  try {
    res = await axios.delete(url + _id);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};

module.exports.sliderUpdate = async (
  body,
  url = config.protocol + config.hostname + ':' + config.port + slider.update
) => {
  var res;
  try {
    res = await axios.put(url, body);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};

module.exports.sliderStatus = async (
  body,
  url = config.protocol + config.hostname + ':' + config.port + slider.Status
) => {
  var res;
  try {
    res = await axios.post(url, body);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};
