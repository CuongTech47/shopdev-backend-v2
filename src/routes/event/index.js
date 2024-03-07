const express = require('express')
const eventController = require('../../controllers/event.controller')
const {authenticationForShop} = require('../../auth/authUtils')
const { uploadDisk } = require('../../configs/multer.conf')
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router()




// create Event

router.get('/get-all-events',asyncHandler(eventController.getAllEvents))
router.get('/get-all-events-shop/:id',asyncHandler(eventController.getAllEventForShop))
router.use(authenticationForShop);
// create Event
router.post('/',uploadDisk.array('images',5),asyncHandler(eventController.createEvent))
router.delete('/delete-shop-event/:id',asyncHandler(eventController.deleteEventForShop))
module.exports = router