const express = require('express');
const { check } = require('express-validator');

const eventsControllers = require('../controllers/events-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/eventslist', eventsControllers.getEventList);

router.get('/:eventID', eventsControllers.getEventById);

router.use(checkAuth);

router.post(
  '/event',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  eventsControllers.createEvent
);

router.patch(
  '/:eventID',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  eventsControllers.updateEvent
);

router.delete('/:eventID', eventsControllers.deleteEvent);

router.get('/myevents/:userID', eventsControllers.getEventsByUserId );

module.exports = router;


