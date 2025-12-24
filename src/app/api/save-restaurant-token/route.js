import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoose";
import Restaurant from "../../../../models/Restaurant";

export async function POST(request) {
  try {
    await connectionToDatabase();
    
    const { restaurantId, fcmToken } = await request.json();
    
    await Restaurant.findOneAndUpdate(
      { restaurantId },
      { fcmToken, lastSeen: new Date() },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token save error:", error);
    return NextResponse.json({ error: "Failed to save token" }, { status: 500 });
  }
}
