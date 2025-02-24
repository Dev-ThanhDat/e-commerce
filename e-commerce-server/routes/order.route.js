const router = require('express').Router();

const orderController = require('../controllers/order.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const verifyIsAdmin = require('../middlewares/verifyIsAdmin.middleware');

router.post('/cash', verifyToken, orderController.createOrder);
router.get('/', verifyToken, orderController.getAllOrders);
router.get('/order', verifyToken, orderController.getOrder);
router.put(
  '/:orderId',
  verifyToken,
  verifyIsAdmin,
  orderController.updateOrderStatus
);
router.delete(
  '/:orderId',
  verifyToken,
  verifyIsAdmin,
  orderController.deleteOrder
);

module.exports = router;
