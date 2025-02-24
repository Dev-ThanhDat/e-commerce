const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Coupon = require('../models/coupon.model');

// ******************************* Add cart *******************************
module.exports.addCart = async (req, res) => {
  try {
    const { productId, quantity, color } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Sản phẩm không tồn tại' });
    }
    let cart = await Cart.findOne({ orderBy: req.userId });
    if (!cart) {
      cart = new Cart({
        products: [
          {
            product: productId,
            quantity,
            color,
            price: product.price
          }
        ],
        cartTotal: product.price * quantity,
        orderBy: req.userId
      });
    } else {
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId && item.color === color
      );
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Sản phẩm đã có trong giỏ hàng!'
        });
      }
      cart.products.push({
        product: productId,
        quantity,
        color,
        price: product.price
      });
      cart.cartTotal = cart.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: 'Thêm vào giỏ hàng thành công!', cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get cart *******************************
module.exports.getCart = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const cart = await Cart.findOne({ orderBy: req.params.userId }).populate(
      'products.product'
    );
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy giỏ hàng!',
      cart
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update product of cart *******************************
module.exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ orderBy: req.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: 'Giỏ hàng không tồn tại' });
    }
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (existingProductIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Sản phẩm không có trong giỏ hàng!' });
    }
    cart.products[existingProductIndex].quantity = quantity;
    cart.cartTotal = cart.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    if (cart.coupon) {
      const coupon = await Coupon.findOne({ code: cart.coupon });
      if (coupon) {
        cart.totalAfterDiscount =
          cart.cartTotal - (cart.cartTotal * coupon.discount) / 100;
      } else {
        cart.totalAfterDiscount = cart.cartTotal;
      }
    } else {
      cart.totalAfterDiscount = cart.cartTotal;
    }
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: 'Cập nhật số lượng thành công!', cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Remove from cart *******************************
module.exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ orderBy: req.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: 'Giỏ hàng không tồn tại' });
    }
    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId
    );
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không có trong giỏ hàng!'
      });
    }
    await Cart.updateOne(
      { orderBy: req.userId },
      { $pull: { products: { product: productId } } }
    );
    cart = await Cart.findOne({ orderBy: req.userId });
    if (cart.products.length === 0) {
      await Cart.findOneAndDelete({ orderBy: req.userId });
      return res.status(200).json({
        success: true,
        message: 'Giỏ hàng đã bị xóa vì không còn sản phẩm!'
      });
    }
    cart.cartTotal = cart.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    if (cart.coupon) {
      const coupon = await Coupon.findOne({ code: cart.coupon });
      if (coupon) {
        cart.totalAfterDiscount =
          cart.cartTotal - (cart.cartTotal * coupon.discount) / 100;
      } else {
        cart.totalAfterDiscount = cart.cartTotal;
      }
    } else {
      cart.totalAfterDiscount = cart.cartTotal;
    }
    await cart.save();
    res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công!',
      cart
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
