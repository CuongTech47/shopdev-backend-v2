"use strict";
const { default: mongoose } = require("mongoose");
const { uploadMultipleImageFromLocal } = require("./upload.service");
const eventModel = require("../models/event.model");
const shopModel = require("../models/shop.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
class EventService {
  static createEvent = async (
    { shopId, email },
    {
      name,
      description,
      category,
      start_Date,
      finish_Date,
      tags,
      originalPrice,
      discountPrice,
      stock,
    },
    images
  ) => {
    const shop = await shopModel.findOne({ email: email });
    if (!shop) {
      throw new BadRequestError("Shop is invalid!", 400);
    }
    const imagesCloud = await uploadMultipleImageFromLocal(
      images,
      `products-event/${shop._id}`
    );

    const eventData = {
      name,
      description,
      category,
      start_Date,
      finish_Date,
      tags,
      originalPrice,
      discountPrice,
      images: imagesCloud,
      stock,
      shopId: new mongoose.Types.ObjectId(shopId),
      shop: shop,
    };

    const product = await eventModel.create(eventData);

    return {
      product,
    };
  };
  static getAllEventForShop = async ({ shopId }) => {
    const events = await eventModel.find({ shopId: shopId });

    // console.log(events);

    return {
      events,
    };
  };

  static deleteEventForShop = async ({ eventId }) => {
    const event = await eventModel.findByIdAndDelete({ _id: eventId });
    if (!event) {
      throw new NotFoundError(`Không tồn tại event id ${eventId}`, 404);
    }
    return event;
  };

  // get all events
  static getAllEvents = async () => {
    const events = await eventModel.find().sort({
      createdAt: -1,
    });
    return {
      events,
    };
  };
}

module.exports = EventService;
