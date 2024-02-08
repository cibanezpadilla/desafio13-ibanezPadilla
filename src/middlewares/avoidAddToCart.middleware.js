import { productsService, usersService } from "../repositoryServices/index.js";

export const avoidAddToCart = () => {
    return async (req, res, next) => {      
      const {pid}  = req.params
      const product = await productsService.findProdById(pid)      
            
      try {  
        /* console.log("product.owner",product.owner)
        console.log("req.user._id",req.user._id)  */                   
          
        if ((req.user.role === 'PREMIUM') && (product.owner.toString() === req.user._id)) {
            return res.json({message: 'You cant buy this product as you own it'})
        }            
        
        next();
      } catch (error) {        
        return res.status(401).json({ message: 'Unauthorized error' });        
      }
    };
  };