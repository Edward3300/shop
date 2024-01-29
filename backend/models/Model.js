const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
});

const cartSchema = new Schema({
  items: [{ type: Schema.Types.ObjectId, ref: 'CartItem' }],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

const cartItemSchema = new Schema({
  productId: { type: Number },
  cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

const orderSchema = new Schema({
  items: [{ type: Number }],
  telephone: { type: String },
  adress: { type: String },
  totalAmount: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Cart = mongoose.model('Cart', cartSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  User,
  Cart,
  CartItem,
  Order,
};
