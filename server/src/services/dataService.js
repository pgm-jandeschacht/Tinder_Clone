/*
Import packages
*/
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/*
Import custom packages
*/
const { HTTPError, convertArrayToPagedObject } = require('../utils');

/*
File paths
*/
const filePathMessages = path.join(__dirname, '..', 'data', 'messages.json');
const filePathMatches = path.join(__dirname, '..', 'data', 'matches.json');
const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');

/*
Write your methods from here
*/

// Read users.json
const readDataFromUsersFile = () => {
  const data = fs.readFileSync(filePathUsers, { encoding: 'utf-8', flag: 'r'});
  const users = JSON.parse(data);

  return users;
};

// Get all users
const getUsers = () => {
  try {
    // Get all users
    const users = readDataFromUsersFile();
    users.sort((a, b) => {
      if (a.lastName > b.lastName) {
        return 1;
      } else if (a.lastName < b.lastName) {
        return -1;
      }
      return 0
    })
    return users;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

// get specific user
const getUserById = (userId) => {
  try {
    // Get all users
    const users = readDataFromUsersFile();
    // filter the array where obj.senderId equals senderId
    const selectedUser = users.find(u => u.id === userId)
    if (!selectedUser) {
      throw new HTTPError(`Can't find users from the user with id ${userId}`, 404);
    }
    return selectedUser;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

// Create a new user
const createUser = (user) => {
  try {
    // Get all users
    const users = readDataFromUsersFile();
    // Create a user
    const  userToCreate = {
      id: uuidv4(),
      ...user,
      createdAt: Date.now()
    };
    users.push(userToCreate);
    // Write user array to users.json file
    fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));
    return userToCreate
  } catch (error) {
    throw new HTTPError('Can\'t create a new user!', 501);
  }
};

// Delete user
const deleteUser = (id) => {
  try {
    // Get all users
    const users = readDataFromUsersFile();
    // Find index of user to delete
    const findIndex = users.findIndex((m) => m.id === id);
    if (findIndex === -1) {
      throw new HTTPError(`Can't find the user with id ${id}!`, 404);
    }
    users.splice(findIndex, 1);
    // Write users array to users.json
    fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));

    return {
      message: `Successfully deleted user with id ${id}`
    }
  } catch (error) {
    throw new HTTPError('can\'t delete user!', 501);
  }
};

// Update user
const updateUser = (id, user) => {
  try {
    const userToUpdate = {
      ...user
    };
  
    userToUpdate.modifiedAt = Date.now();

    // Get all users
    const users = readDataFromUsersFile();
    // Find index of user to delete
    const findIndex = users.findIndex((m) => m.id === id);
    if (findIndex === -1) {
      throw new HTTPError(`Can't find the user with id ${id}!`, 404);
    }

    users[findIndex] = {
      ...users[findIndex],
      ...userToUpdate,
    };
  
    fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));

    return {
      message: `Successfully updated user with id ${id}`
    }
  } catch (error) {
    throw new HTTPError('can\'t update user!', 501);
  }
};

// Read messages.json
const readDataFromMessagesFile = () => {
  const data = fs.readFileSync(filePathMessages, { encoding: 'utf-8', flag: 'r'});
  const messages = JSON.parse(data);

  return messages;
};

// Get all messages
const getMessages = () => {
  try {
        // Get all messages
    const messages = readDataFromMessagesFile();
    messages.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      } else if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0
    })
    return messages;
  } catch (error) {
    throw new HTTPError('Can\'t get messages!', 500);
  }
};

// Get specific message
const getMessageById = (messageId) => {
  try {
    // Get all messages
    const messages = readDataFromMessagesFile();
    // Filter the array
    const selectedMessage = messages.find(m => m.id === messageId)
    if (!selectedMessage) {
      throw new HTTPError(`Can't find messages from the user with id ${messageId}`, 404);
    }
    return selectedMessage;
  } catch (error) {
    throw new HTTPError('Can\'t get message!', 500);
  }
};

// Get all messages from user
const getMessagesFromUserId = (userId) => {
  try {
    // Get all messages
    const messages = readDataFromMessagesFile();
    // Filter the array
    const selectedMessages = messages.filter(m => ((m.senderId === userId) || (m.receiverId === userId)))
    if (!selectedMessages) {
      throw new HTTPError(`Can't find messages from the user with id ${senderId}`, 404);
    }
    selectedMessages.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      } else if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0
    })
    return selectedMessages;
  } catch (error) {
    throw new HTTPError('Can\'t find messages!', 501);
  }
};

// Get all messages sent from user
const getMessagesSentFromUserId = (userId) => {
  try {
    // Get all messages
    const messages = readDataFromMessagesFile();
    // Filter the array
    const selectedMessages = messages.filter(m => m.senderId === userId)
    if (!selectedMessages) {
      throw new HTTPError(`Can't find messages sent by the user with id ${senderId}`, 404);
    }
    selectedMessages.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      } else if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0
    })
    return selectedMessages;
  } catch (error) {
    throw new HTTPError('Can\'t find sent message!', 501);
  }
};

// Get all messages received from user
const getMessagesReceivedFromUserId = (userId) => {
  try {
    // Get all messages
    const messages = readDataFromMessagesFile();
    // Filter the array
    const selectedMessages = messages.filter(m => m.receiverId === userId)
    if (!selectedMessages) {
      throw new HTTPError(`Can't find messages received by the user with id ${receiverId}`, 404);
    }
    selectedMessages.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      } else if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0
    })
    return selectedMessages;
  } catch (error) {
    throw new HTTPError('Can\'t find received message!', 501);
  }
};

// Get all messages between 2 users
const getMessagesBetweenUsers = (userId, friendId) => {
  try {
    //Get all messages
    const messages = readDataFromMessagesFile();
    // Filter the array
    const selectedMessages = messages.filter(m => ((m.senderId === userId && m.receiverId === friendId) || (m.senderId === friendId && m.receiverId === userId)))
    if (!selectedMessages) {
      throw new HTTPError(`Can't find message from the user with id ${userId} and user with id ${friendId}`, 404);
    }
    selectedMessages.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      } else if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0
    })
    return selectedMessages;
  } catch (error) {
    throw new HTTPError('Can\'t find message!', 501);
  }
};

// Create a new message
const createMessage = (message) => {
  try {
    // Get all messages
    const messages = readDataFromMessagesFile();
    // Create a message
    const  messageToCreate = {
      ...message,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    messages.push(messageToCreate);
    // Write message array to messages.json file
    fs.writeFileSync(filePathMessages, JSON.stringify(messages, null, 2));
    // Return the created message
    return messageToCreate
  } catch (error) {
    throw new HTTPError('Can\'t create a new message!', 501);
  }
};

// Delete message
const deleteMessage = (id) => {
  try {
    // Get all messages
    const messages = readDataFromMessagesFile();
    // Find index of message to delete
    const findIndex = messages.findIndex((m) => m.id === id);
    if (findIndex === -1) {
      throw new HTTPError(`Can't find the message with id ${id}!`, 404);
    }
    messages.splice(findIndex, 1);
    // Write message array to messages.json
    fs.writeFileSync(filePathMessages, JSON.stringify(messages, null, 2));

    return {
      message: `Successfully deleted message with id ${id}`
    }
  } catch (error) {
    throw new HTTPError('can\'t delete message!', 501);
  }
};

// Update message
const updateMessage = (id, message) => {
  try {
    const messageToUpdate = {
      ...message
    };
  
    messageToUpdate.modifiedAt = Date.now();

    // Get all messages
    const messages = readDataFromMessagesFile();
    // Find index of message to delete
    const findIndex = messages.findIndex((m) => m.id === id);
    if (findIndex === -1) {
      throw new HTTPError(`Can't find the message with id ${id}!`, 404);
    }

    messages[findIndex] = {
      ...messages[findIndex],
      ...messageToUpdate,
    };
    // Write message array to messages.json
    fs.writeFileSync(filePathMessages, JSON.stringify(messages, null, 2));

    return {
      message: `Successfully updated message with id ${id}`
    }
  } catch (error) {
    throw new HTTPError('can\'t update message!', 501);
  }
};

// Read matches.json
const readDataFromMatchesFile = () => {
  const data = fs.readFileSync(filePathMatches, { encoding: 'utf-8', flag: 'r' });
  const matches = JSON.parse(data);

  return matches;
};

// get all matches
const getMatches = () => {
  try {
    const matches = readDataFromMatchesFile();
    matches.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      } else if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0
    })
    return matches;
  } catch (error) {
    throw new HTTPError('Can\'t get matches!', 500);
  }
};

// Get all matches from user
const getMatchesFromUserId = (userId) => {
  try {
    const matches = readDataFromMatchesFile();
    // Filter the array
    const selectedMatches = matches.filter(m => ((m.userId === userId) || (m.friendId === userId)))
    if (!selectedMatches) {
      throw new HTTPError(`Can't find matches from the user with id ${userId}`, 404);
    }
    selectedMatches.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      } else if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0
    })
    return selectedMatches;
  } catch (error) {
    throw error;
  }
};

// Get specific match
const getMatchById = (senderId, receiverId) => {
  try {
    // Get all matches
    const matches = readDataFromMatchesFile();
    // Filter the array
    const selectedMatch = matches.filter(m => ((m.userId === senderId) && (m.friendId === receiverId)));
    if (!selectedMatch) {
      throw new HTTPError(`Can't find match from the user with id ${senderId} and user with id ${receiverId}`, 404);
    }
    return selectedMatch;
  } catch (error) {
    throw new HTTPError('Can\'t find match!', 501);
  }
};

// Create a new match
const createMatch = (match) => {
  try {
    // Get all matches
    const matches = readDataFromMatchesFile();
    // Create a match
    const  matchToCreate = {
      ...match,
      createdAt: Date.now(),
    };
    matches.push(matchToCreate);
    // Write match array to matches.json file
    fs.writeFileSync(filePathMatches, JSON.stringify(matches, null, 2));
    // Return the created match
    return matchToCreate
  } catch (error) {
    throw new HTTPError('Can\'t create a new match!', 501);
  }
};

// Delete match
const deleteMatch = (senderId, receiverId) => {
  try {
    // Get all matches
    const matches = readDataFromMatchesFile();
    // Find index of match to delete
    const findIndex = matches.findIndex((m) => ((m.userId === senderId) && (m.friendId === receiverId)));
    if (findIndex === -1) {
      throw new HTTPError(`Can't find the match with sender id ${senderId} and receiver id ${receiverId}!`, 404);
    }
    matches.splice(findIndex, 1);
    // Write match array to matches.json
    fs.writeFileSync(filePathMatches, JSON.stringify(matches, null, 2));

    return {
      message: `Successfully deleted match with sender id ${senderId} en receiver ${receiverId}`
    }
  } catch (error) {
    throw new HTTPError('can\'t delete match!', 501);
  }
};

// Update match
const updateMatch = (senderId, receiverId, rating) => {
  try {
    const matchToUpdate = {
      ...rating
    };
  
    matchToUpdate.modifiedAt = Date.now();

    // Get all matches
    const matches = readDataFromMatchesFile();
    // Find index of match to change
    const findIndex = matches.findIndex((m) => ((m.userId === senderId) && (m.friendId === receiverId)));
    if (findIndex === -1) {
      throw new HTTPError(`Can't find the match with sender id ${senderId} and receiver id ${receiverId}!`, 404);
    }

    matches[findIndex] = {
      ...matches[findIndex],
      ...matchToUpdate,
    };
  
    fs.writeFileSync(filePathMatches, JSON.stringify(matches, null, 2));

    return {
      message: `Successfully updated match with sender id ${senderId} and receiver id ${receiverId}`
    }
  } catch (error) {
    throw new HTTPError('can\'t update match!', 501);
  }
};


// Export all the methods of the data service
module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  getMessages,
  getMessagesFromUserId,
  getMessageById,
  getMessagesSentFromUserId,
  getMessagesReceivedFromUserId,
  getMessagesBetweenUsers,
  createMessage,
  deleteMessage,
  updateMessage,
  getMatches,
  getMatchesFromUserId,
  getMatchById,
  createMatch,
  deleteMatch,
  updateMatch,
};
