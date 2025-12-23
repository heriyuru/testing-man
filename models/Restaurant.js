// models/Restaurant.js
import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  restaurantId: { type: Number, required: true, unique: true },
  fcmToken: { type: String, default: null },
  lastSeen: { type: Date, default: Date.now }
});

export default mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);
