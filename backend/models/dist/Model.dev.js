"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  сart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  }
});
var cartSchema = new Schema({
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'CartItem'
  }]
});
var cartItemSchema = new Schema({
  productId: {
    type: Number
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  } // itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },

});
var User = mongoose.model('User', userSchema);
var Cart = mongoose.model('Cart', cartSchema);
var CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = {
  User: User,
  Cart: Cart,
  CartItem: CartItem
};