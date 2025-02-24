const User = require('../models/user.model');
const Product = require('../models/product.model');

// ******************************* Get all users *******************************
module.exports.getAllUsers = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    let query = {};
    if (search) {
      query = {
        $or: [
          { firstname: { $regex: search, $options: 'i' } },
          { lastname: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy các người dùng!',
      users,
      total
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get a single user *******************************
module.exports.getAUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    if (!req.params.userId) {
      return res.status(400).json({
        success: false,
        message: 'ID người dùng là bắt buộc!'
      });
    }
    const user = await User.findById(req.params.userId).select(
      '-password -refreshToken'
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Đã tìm thấy người dùng!',
      user
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Update a user *******************************
module.exports.updateAUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname
      },
      {
        new: true
      }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật người dùng thành công!',
      user
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Delete a user *******************************
module.exports.deleteAUser = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({
        success: false,
        message: 'ID người dùng là bắt buộc!'
      });
    }
    await Product.updateMany(
      { 'ratings.postedby': req.params.userId },
      {
        $pull: {
          ratings: { postedby: req.params.userId }
        }
      }
    );
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Xóa người dùng thành công!'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Add to wishlist *******************************
module.exports.addToWishlist = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!'
      });
    }
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === req.params.productId
    );
    if (alreadyAdded) {
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $pull: { wishlist: req.params.productId }
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: 'Xóa sản phẩm khỏi danh sách yêu thích thành công!',
        user
      });
    } else {
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $push: { wishlist: req.params.productId }
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: 'Thêm sản phẩm vào danh sách yêu thích thành công!',
        user
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ******************************* Get wishlist *******************************
module.exports.getWishlist = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền!'
      });
    }
    const wishlist = await User.findById(req.params.userId)
      .select('wishlist')
      .populate('wishlist');
    return res.status(200).json({
      success: true,
      message: 'Đã lấy danh sách sản phẩm yêu thích!',
      wishlist
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
