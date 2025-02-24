const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: 'Không có token nào được cung cấp!'
    });
  }
  try {
    const { id } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    req.userId = id;
    next();
  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      return res.status(410).json({
        success: false,
        message: 'Token hết hạn!'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Không có token nào được cung cấp!'
    });
  }
};
