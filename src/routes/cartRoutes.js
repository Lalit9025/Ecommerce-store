import express from 'express'
import { store } from '../store/index.js'
import { validateAddToCart, validateCheckout } from '../middleware/validation.js';

const router = express.Router();

router.post('/add', validateAddToCart, (req, res) => {
    const { userId, productId, name, price, quantity} = req.body;
    const item = { productId, name, price, quantity};
    const cart = store.addItemTocart(userId, item);
    res.json(cart);
})

router.get('/:userId', (req, res) => {
    const cart = store.getCart(req.params.userId);
    if(!cart){
        return res.status(404).json({error: 'Cart not found'});
    }
    res.json(cart);
});

router.post('/checkout', validateCheckout, (req, res) => {
    const { userId, discountCode } = req.body;
    const cart = store.getCart(userId);

    if(!cart){
        return res.status(404).json({ error: 'Cart not found'});
    }
    if(discountCode && !store.isValidDiscountCode(discountCode)){
        return res.status(400).json({ error: 'Invalid discount code'});
    }

    const order = store.createOrder(userId, cart, discountCode);
    res.json(order);
});

export default router;

