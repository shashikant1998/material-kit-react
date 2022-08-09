const axios = require("axios");
const config = require("../config/config");
const role = require("../config/roleConfig");

module.exports.roleAdd = async (
  body,
  url = config.protocol + config.hostname + ":" + config.port + role.add
) => {
  var res;
  try {
    res = await axios.post(url, body);
    console.log("hii", res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};

module.exports.roleView = async (
  url = config.protocol + config.hostname + ":" + config.port + role.view
) => {
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

module.exports.roleEdit = async (
  _id,
  url = config.protocol + config.hostname + ":" + config.port + role.edit
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

module.exports.roleDelete = async (
  _id,
  url = config.protocol + config.hostname + ":" + config.port + role.delete
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

module.exports.roleUpdate = async (
  body,
  url = config.protocol + config.hostname + ":" + config.port + role.update
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
