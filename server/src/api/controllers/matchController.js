/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { HTTPError, handleHTTPError } = require('../../utils');

/*
Get all matches
*/
const getMatches = (req, res, next) => {
  try {
    // Get matches from dataService
    const matches = dataService.getMatches();
    // Send response
    res.status(200).json(matches);
  } catch(error) {
    handleHTTPError(error, next);
  }
};

/*
Get a specific match
*/
const getMatchByIds = (req, res, next) => {
  try {
    // Get parameter from url
    const { senderId, receiverId } = req.params;
    // Get matches from dataService
    const match = dataService.getMatchById(senderId, receiverId);
    // Send response
    res.status(200).json(match);
  } catch(error) {
    handleHTTPError(error, next);
  }
};

/*
Get matches from a specific user
*/
const getMatchesFromUserById = (req, res, next) => {
  try {
    // Get parameter from url
    const { userId } = req.params;
    // Get matches from specific user
    const matches = dataService.getMatchesFromUserId(userId);
    // Send response
    res.status(200).json(matches);
  } catch(error) {
    handleHTTPError(error, next);
  };
};

/*
Create a new match
*/
const createMatch = (req, res, next) => {
  try {
    // Get body (match) from request
    const match = req.body;
    // Creat a match
    const createMatch = dataService.createMatch(match);
    // Send response
    res.status(201).json(createMatch);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Update a specific match
*/
const updateMatch = (req, res, next) => {
  try {
    // Get parameter from url
    const { senderId, receiverId } = req.params;
    // Get body (match) from request
    const rating = req.body;
    // Update match
    const updateMatch = dataService.updateMatch(senderId, receiverId, rating);
    // Send response
    res.status(200).json(updateMatch);
  } catch (error) {
    handleHTTPError(error, next);
  }};

/*
Delete a specific match
*/
const deleteMatch = (req, res, next) => {
  try {
    // Get parameter from url
    const { senderId, receiverId } = req.params;
    // Delete match
    const match = dataService.deleteMatch(senderId, receiverId);
    // Send response
    res.status(200).json(match);
  } catch (error) {
    handleHTTPError(error, next);
  }};

// Export the action methods = callbacks
module.exports = {
  createMatch,
  deleteMatch,
  getMatches,
  getMatchByIds,
  getMatchesFromUserById,
  updateMatch,
};
