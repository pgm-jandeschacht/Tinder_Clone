/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { HTTPError, handleHTTPError } = require('../../utils');

/*
Get all messages
*/
const getMessages = (req, res, next) => {
  try {
    // Get messages from dataService
    const messages = dataService.getMessages();
    // Send response
    res.status(200).json(messages);
  } catch(error) {
    handleHTTPError(error, next);
  }
};

/*
Get a specific message
*/
const getMessageById = (req, res, next) => {
  try {
    // get parameter from url
    const { messageId } = req.params;
    // Get messages from dataService
    const message = dataService.getMessageById(messageId);
    // Send response
    res.status(200).json(message);
  } catch(error) {
    handleHTTPError(error, next);
  }};

/*
Get messages from a specific user
*/
const getMessagesFromUserById = (req, res, next) => {
  try {
    // Get parameter from url and query
    const { type, friendId } = req.query;
    const { userId } = req.params;
    if (type === 'sent') {
      // Get messages from dataService
      const messagesSent = dataService.getMessagesSentFromUserId(userId);
      // Send response
      res.status(200).json(messagesSent);
    } else if (type === 'received' ) {
      // Get messages from dataService
      const messagesRec = dataService.getMessagesReceivedFromUserId(userId);
      // Send response
      res.status(200).json(messagesRec)
    } else if (type === 'conversation') {
      // Get messages from dataService
      const conversation = dataService.getMessagesBetweenUsers(userId, friendId);
      // Send response
      res.status(200).json(conversation)
    } else {
      // Get messages from dataService
      const allMessages = dataService.getMessagesFromUserId(userId)
      // Send response
      res.status(200).json(allMessages)
    }

  } catch(error) {
    handleHTTPError(error, next);
  };
};

/*
Create a new message
*/
const createMessage = (req, res, next) => {
  try {
    // Get body (message) from request
    const message = req.body;
    // Creat a message
    const createMessage = dataService.createMessage(message);
    // Send response
    res.status(201).json(createMessage);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Update a specific message
*/
const updateMessage = (req, res, next) => {
  try {
    // Get parameter from url
    const { messageId } = req.params;
    // Get body (message) from request
    const message = req.body;
    // Update message
    const updateMessage = dataService.updateMessage(messageId, message);
    // Send response
    res.status(200).json(updateMessage);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Delete a specific message
*/
const deleteMessage = (req, res, next) => {
  try {
    // Get parameter from url
    const { messageId } = req.params;
    // Delete message
    const message = dataService.deleteMessage(messageId);
    // Send response
    res.status(200).json(message);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

// Export the action methods = callbacks
module.exports = {
  createMessage,
  deleteMessage,
  getMessages,
  getMessageById,
  getMessagesFromUserById,
  updateMessage,
};
