/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { HTTPError, handleHTTPError } = require('../../utils');

/*
Get all users
*/
const getUsers = (req, res, next) => {
  try {
    // Get users from dataService
    const users = dataService.getUsers();
    // Send response
    res.status(200).json(users);
  } catch(error) {
    handleHTTPError(error, next);
  }
};

/*
Get a specific user
*/
const getUserById = (req, res, next) => {
  try {
    // Get parameter from url
    const { userId } = req.params;
    // Get users from dataService
    const user = dataService.getUserById(userId);
    // Send response
    res.status(200).json(user);
  } catch(error) {
    handleHTTPError(error, next);
  }
};

/*
Create a new user
*/
const createUser = (req, res, next) => {
  try {
    // Get body (user) from request
    const user = req.body;
    // Creat a user
    const createUser = dataService.createUser(user);
    // Send response
    res.status(201).json(createUser);
  } catch (error) {
    handleHTTPError(error, next);
  }};

/*
Update a specific user
*/
const updateUser = (req, res, next) => {
  try {
    // Get parameter from url
    const { userId } = req.params;
    // Get body (user) from request
    const user = req.body;
    // Update user
    const updateUser = dataService.updateUser(userId, user);
    // Send response
    res.status(200).json(updateUser);
  } catch (error) {
    handleHTTPError(error, next);
  }};

/*
Delete a specific user
*/
const deleteUser = (req, res, next) => {
  try {
    // Get parameter from url
    const { userId } = req.params;
    // Delete user
    const user = dataService.deleteUser(userId);
    // Send response
    res.status(200).json(user);
  } catch (error) {
    handleHTTPError(error, next);
  }};

// Export the action methods = callbacks
module.exports = {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
};
