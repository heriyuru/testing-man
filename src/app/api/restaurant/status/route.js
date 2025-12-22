import { NextResponse } from 'next/server';
import connectionToDatabase from '@/lib/mongoose'; // Make sure this path to your mongoose.js is correct
import Restaurant from '@/models/Restaurant'; // Make sure this path to your model is correct

// 1. GET: This is called by the Customer Page to see which restaurants are open
export async function GET() {
    try {
        await connectionToDatabase();
        
        // Fetch all restaurants and get their restid and isOpen status
        const restaurants = await Restaurant.find({}, 'restid isOpen');
        
        // Create an object like { "1": true, "3": false }
        const statuses = {};
        restaurants.forEach(res => {
            statuses[res.restid] = res.isOpen;
        });

        return NextResponse.json({ success: true, statuses });
    } catch (err) {
        console.error("GET Status Error:", err);
        return NextResponse.json({ success: false, message: "Database error" });
    }
}

// 2. POST: This is called by the Owner (OrdersList) to flip the Active/OFF switch
export async function POST(req) {
    try {
        await connectionToDatabase();
        const { restaurantId, isOpen } = await req.json();

        if (!restaurantId) {
            return NextResponse.json({ success: false, message: "Restaurant ID is missing" });
        }

        // Update the isOpen field in your MongoDB for this restaurant
        await Restaurant.findOneAndUpdate(
            { restid: restaurantId },
            { isOpen: isOpen },
            { upsert: true } // This creates the record if it doesn't exist yet
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("POST Status Error:", err);
        return NextResponse.json({ success: false, message: err.message });
    }
}