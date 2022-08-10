const axios = require('axios');
const config = require('../config/config');
const category = require('../config/categoryConfig');

module.exports.categoryAdd = async (
  body,
  url = config.protocol + config.hostname + ':' + config.port + category.add
) => {
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

module.exports.categoryView = async (url = config.protocol + config.hostname + ':' + config.port + category.view) => {
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

module.exports.categoryEdit = async (
  _id,
  url = config.protocol + config.hostname + ':' + config.port + category.edit
) => {
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

module.exports.categoryDelete = async (
  _id,
  url = config.protocol + config.hostname + ':' + config.port + category.delete
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

module.exports.categoryUpdate = async (
  body,
  url = config.protocol + config.hostname + ':' + config.port + category.update
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
