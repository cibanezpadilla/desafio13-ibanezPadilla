import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({  
  products: { 
    type: [
      {      
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number  
        },
        _id: false     
      }
    ],
    default: []
  }
});

export const cartsModel = mongoose.model("Carts", cartsSchema);

/* mirar en resumen afterclass 31 que el profe lo tiene distintom
distintos los corchetes y sin el default */