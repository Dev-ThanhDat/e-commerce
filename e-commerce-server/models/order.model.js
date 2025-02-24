const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number
        },
        color: {
          type: String
        }
      }
    ],
    amount: {
      type: Number,
      required: true
    },
    orderStatus: {
      type: String,
      default: 'Chưa được xử lý'
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    infor: {
      firstname: {
        type: String,
        required: true
      },
      lastname: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
