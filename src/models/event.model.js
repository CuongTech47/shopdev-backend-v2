"use strict";
const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Event";
const COLLECTION_NAME = "Events";
const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your event product name!"],
    },
    description: {
      type: String,
      required: [true, "Please enter your event product description!"],
    },
    category: {
      type: String,
      required: [true, "Please enter your event product category!"],
    },
    start_Date: {
      type: Date,
      required: true,
    },
    finish_Date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "Running",
    },
    tags: {
      type: String,
    },
    originalPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      required: [true, "Please enter your event product price!"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter your event product stock!"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    shop: {
      type: Object,
      required: true,
    },
    shop: {
      type: Object,
      required: true,
    },
    sold_out: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, eventSchema);
