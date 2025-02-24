const router = require('express').Router();

const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.get(
  '/all-users',
  verifyToken,
  verifyIsAdmin,
  userController.getAllUsers
);
router.put('/update', verifyToken, userController.updateAUser);
router.get('/:userId', verifyToken, userController.getAUser);
router.delete('/:userId', verifyToken, userController.deleteAUser);
router.get('/wishlist/:userId', verifyToken, userController.getWishlist);
router.post('/wishlist/:productId', verifyToken, userController.addToWishlist);

module.exports = router;
