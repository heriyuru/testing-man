import mongoose from "mongoose";

const acceptedOrderSchema = new mongoose.Schema({
  // --- ADD THIS FIELD ---
  orderId: { 
    type: String, 
    required: true, 
    unique: true // This matches the index in your database
  },
  // -----------------------

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      itemId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalCount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  restaurantId: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  rest: { type: String },
  status: { type: String, default: "active" },
});

const AcceptedOrder =
  mongoose.models.AcceptedOrder || mongoose.model("AcceptedOrder", acceptedOrderSchema);

export default AcceptedOrder;