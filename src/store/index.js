class Store{
    constructor(){
        this.carts = new Map();
        this.orders = [];
        this.activeDiscountCodes = new Set();
        this.usedDiscountCodes = new Set();
        this.orderCounter = 0;
        this.NTH_ORDER = 5;
        this.DISCOUNT_PERCENTAGE = 0.10;
    }

    getCart(userId){
        return this.carts.get(userId);
    }

    createCart(userId){
        const cart = {
            userId,
            items: [],
            totalAmount: 0
        };
        this.carts.set(userId, cart);
        return cart;
    }
    addItemTocart(userId, item){
        let cart = this.getCart(userId);
        if(!cart){
            cart = this.createCart(userId);
        }

        const existingItem = cart.items.find(i => i.productId === item.productId);

        if(existingItem){
            existingItem.quantity += item.quantity;
        } else {
            cart.items.push(item);
        }

        cart.totalAmount = this.calculateTotal(cart.items);
        return cart;
    }

    calculateTotal(items){
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    createOrder(userId, cart, discountCode){
        this.orderCounter++;
        const discountAmount = this.calculateDiscount(cart.totalAmount, discountCode);

        const order = {
            orderId: `ORDER-${this.orderCounter}`,
            userId,
            items:[...cart.items],
            originalAmount : cart.totalAmount,
            discountAmount,
            finalAmount: cart.totalAmount - discountAmount,
            discountCode,
            timestamp: new Date()
        };
        if(discountCode){
            this.usedDiscountCode(discountCode);
        }

        this.orders.push(order);
        this.carts.delete(userId);

        if(this.shouldGenerateDiscount()){
            this.generateDiscountCode();
        }

        return order;
    }

    shouldGenerateDiscount(){
        return this.orderCounter % this.NTH_ORDER === 0;
    }

    generateDiscountCode(){
        const code = `DISCOUNT - ${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        this.activeDiscountCodes.add(code);
        return code;
    }
    isValidDiscountCode(code){
        return this.activeDiscountCodes.has(code) && !this.usedDiscountCodes.has(code);
    }

    usedDiscountCode(code){
        if(this.isValidDiscountCode(code)){
            this.activeDiscountCodes.delete(code);
            this.usedDiscountCodes.add(code);
            return true;
        }
        return false;
    }
    calculateDiscount(amount, discountCode){
        if(this.isValidDiscountCode(discountCode)){
            return amount* this.DISCOUNT_PERCENTAGE;
        }
        return 0;
    }
    getStats(){
        const totalItems = this.orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

        const totalPurchaseAmount = this.orders.reduce((sum, orders) => sum + orders.originalAmount, 0);
        const totalDiscountAmount = this.orders.reduce((sum, order) => sum + order.discountAmount, 0);

        return {
            totalItems,
            totalPurchaseAmount,
            totalDiscountAmount,
            activeDiscountCodes: Array.from(this.activeDiscountCodes),
            usedDiscountCodes: Array.from(this.usedDiscountCodes)
        };
    }
}

export const store = new Store();