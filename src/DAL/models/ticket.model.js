import mongoose from 'mongoose';

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        required: true, 
        /* default: Date.now, */
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String, 
        /* type: mongoose.SchemaType.ObjectId,
        ref: "users", */
        /* match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, */
        required: true
    },
    /* products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                _id: false
            }
        ]
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Partially Shipped", "Canceled", "Refunded", "On Hold", "Returned", "Complete", "Failed"],
        default: "Pending"
    } */
})

export const ticketModel = mongoose.model("tickets", ticketsSchema);