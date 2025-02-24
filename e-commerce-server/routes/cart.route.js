const router = require('express').Router();

const cartController = require('../controllers/cart.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');

router.post('/add', verifyToken, cartController.addCart);
router.put('/update', verifyToken, cartController.updateCartQuantity);
router.post('/remove-product', verifyToken, cartController.removeFromCart);
router.get('/:userId', verifyToken, cartController.getCart);

module.exports = router;
