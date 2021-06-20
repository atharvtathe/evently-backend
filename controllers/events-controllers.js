const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Event = require('../models/event');
const User = require('../models/user');

const getEventById = async (req, res, next) => {
  const eventID = req.params.eventID;

  let event;
  try {
    event = await Event.findById(eventID);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a event.',
      500
    );
    return next(error);
  }

  if (!event) {
    const error = new HttpError(
      'Could not find event for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ event: event.toObject({ getters: true }) });
};


const getEventList = async (req, res, next) => {

  let event;
  try {
    event = await Event.find({});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a event.',
      500
    );
    return next(error);
  }

  if (!event) {
    const error = new HttpError(
      'Could not find events.',
      404
    );
    return next(error);
  }

  res.json({ event: event });
};


const getEventsByUserId = async (req, res, next) => {
  const userId = req.params.userID;


  let userWithEvents;
  try {
    userWithEvents = await Event.find({creator : userId});
  } catch (err) {
    const error = new HttpError(
      'Fetching events failed, please try again later.',
      500
    );
    return next(error);
  }

  if (userId !== req.userData.userId) {
    const error = new HttpError('You are not allowed to get this events.', 401);
    return next(error);
  }


  if (!userWithEvents) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({
    events : userWithEvents
  })
};




const createEvent = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description} = req.body;

  const createdEvent = new Event({
    title,
    description,
    image: req.file.path,
    creator: req.userData.userId
  });

  try {
    await createdEvent.save();
  } catch (err) {
    const error = new HttpError(
      'Creating event failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};





const updateEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const eventId = req.params.eventID;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  if (event.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401);
    return next(error);
  }

  event.title = title;
  event.description = description;

  try {
    await event.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};




const deleteEvent = async (req, res, next) => {
  const eventId = req.params.eventID;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete event.',
      500
    );
    return next(error);
  }

  if (!event) {
    const error = new HttpError('Could not find event for this id.', 404);
    return next(error);
  }

  if (event.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this event.',
      401
    );
    return next(error);
  }

  const imagePath = event.image;

  try {
    await Event.deleteOne({_id : eventId});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    if(err) {
      console.log(err);
    }
  });

  res.status(200).json({ message: 'Deleted place.' });
};




exports.getEventById = getEventById;
exports.getEventList = getEventList ;
exports.getEventsByUserId = getEventsByUserId;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
