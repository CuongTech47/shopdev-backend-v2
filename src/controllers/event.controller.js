"use strict";

const { BadRequestError } = require("../core/error.response");
const { CREATED, SuccessResponse } = require("../core/success.response");
const EventService = require("../services/event.service");

class EventController {
  createEvent = async (req, res, next) => {
    // console.log(req.body.images);
    let images = [];

    if (!req.body.images) {
      throw new BadRequestError("hình ảnh bị thiếu");
    }
    if (typeof req.body.images === "string") {
      // Nếu chỉ có một hình ảnh, chúng ta đưa nó vào mảng images
      images.push(req.body.images);
    } else if (Array.isArray(req.body.images)) {
      // Nếu là một mảng, chúng ta duyệt qua từng phần tử và đưa vào mảng images
      for (const image of req.body.images) {
        images.push(image);
      }
    } else {
      // Nếu không phải là một chuỗi hoặc mảng, báo lỗi
      throw new BadRequestError("Định dạng hình ảnh không hợp lệ");
    }
    // console.log(images);
    new CREATED({
      message: "Create Event Success",
      metadata: await EventService.createEvent(
        req.shop,
        { ...req.body },
        images
      ),
    }).send(res);
  };

  getAllEventForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all events for shop success",
      metadata: await EventService.getAllEventForShop({
        shopId: req.params.id,
      }),
    }).send(res);
  };
  deleteEventForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete Event for shop success",
      metadata: await EventService.deleteEventForShop({
        eventId: req.params.id,
      }),
    }).send(res);
  };


  getAllEvents = async (req , res ,next) => {
    new SuccessResponse({
      metadata: await EventService.getAllEvents()
    }).send(res)
  }
}

module.exports = new EventController();
