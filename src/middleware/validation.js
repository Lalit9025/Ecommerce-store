export const validateAddToCart = (req, res, next) => {
    const { userId, productId, name, price, quantity } = req.body;

    if(!userId || !productId || !name || !price || !quantity){
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    if(typeof price !== 'number' || price <= 0){
        return res.status(400).json({
            error: 'Price must be a positive number'
        })
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          error: 'Quantity must be a positive integer'
        });
    }

    next();

}
export const validateCheckout = (req, res, next) => {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Missing userId'
      });
    }
  
    next();
  };