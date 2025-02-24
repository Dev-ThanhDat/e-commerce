const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');

// ******************************* Create order *******************************
module.exports.createOrder = async (req, res) => {
  try {
    const { couponApplied, firstname, lastname, address, city, phone } =
      req.body;
    const user = await User.findOne({ _id: req.userId });
    const cart = await Cart.findOne({ orderBy: user._id });
    if (!cart) {
      return res
        .status(400)
        .json({ message: 'Không tìm thấy giỏ hàng cho người dùng!' });
    }
    const finalAmount =
      couponApplied && cart.totalAfterDiscount
        ? cart.totalAfterDiscount
        : cart.cartTotal;
    const order = await new Order({
      products: cart.products,
      amount: finalAmount,
      orderBy: user._id,
      infor: {
        firstname,
        lastname,
        address,
        city,
        phone
      }
    }).save();
    const update = cart.products.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
      }
    }));
    await Product.bulkWrite(update);
    await Cart.findOneAndDelete({ orderBy: user._id });
    res.status(200).json({
      success: true,
      message: 'Đơn hàng được đặt thành công!',
      order
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get order *******************************
module.exports.getOrder = async (req, res) => {
  try {
    const { orderId, status, page = 1, limit = 8 } = req.query;
    const query = { orderBy: req.userId };
    if (orderId) {
      query._id = orderId;
    }
    if (status) {
      query.orderStatus = status;
    }
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('products.product');
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy đơn hàng!',
      orders,
      total
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update order status *******************************
module.exports.updateOrderStatus = async (req, res) => {
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus: req.body.status },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công!',
      updateOrderStatus
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get all orders *******************************
module.exports.getAllOrders = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    let query = {};
    if (search) {
      query = { _id: search };
    }
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .populate('products.product')
      .populate({
        path: 'orderBy',
        select: 'firstname lastname email _id'
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy tất cả đơn hàng!',
      orders,
      total
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Delete order *******************************
module.exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công!',
      deletedOrder
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
