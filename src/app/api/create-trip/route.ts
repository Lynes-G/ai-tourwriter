import { appwriteConfig, database } from "@/appwrite/client";
import { parseMarkdownToJson } from "@/lib/utils";
import { GoogleGenAI } from "@google/genai";
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        {
          error: "Invalid request body",
          message: "Request must contain valid JSON",
        },
        { status: 400 },
      );
    }

    const {
      country,
      numberOfDays,
      travelStyle,
      interest,
      budget,
      groupType,
      userId,
    } = requestBody;

    // Validate required parameters
    if (!country || !numberOfDays || !userId) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: country, numberOfDays, and userId are required",
        },
        { status: 400 },
      );
    }

    // Validate environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 },
      );
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY || "";

    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interests: '${interest}'
    TravelStyle: '${travelStyle}'
    GroupType: '${groupType}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${numberOfDays},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "country": "${country}",
    "interests": ${interest},
    "groupType": "${groupType}",
    "bestTimeToVisit": [
      '🌸 Season (from month to month): reason to visit',
      '☀️ Season (from month to month): reason to visit',
      '🍁 Season (from month to month): reason to visit',
      '❄️ Season (from month to month): reason to visit'
    ],
    "weatherInfo": [
      '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
    ],
    "location": {
      "city": "name of the city or region",
      "coordinates": [latitude, longitude],
      "openStreetMap": "link to open street map"
    },
    "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
      ]
    },
    ...
    ]
    }`; // Generate travel itinerary using AI
    const textResult = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [prompt],
    });

    if (!textResult.text) {
      throw new Error("Failed to generate travel itinerary from AI");
    }

    const trip = parseMarkdownToJson(textResult.text);

    if (!trip) {
      throw new Error("Failed to parse AI response into valid JSON");
    } // Fetch images from Unsplash with better error handling
    let imageUrls: string[] = [];
    try {
      const imageResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${country} ${interest} ${travelStyle}&client_id=${unsplashApiKey}`,
      );

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();

        if (
          imageData &&
          imageData.results &&
          Array.isArray(imageData.results)
        ) {
          imageUrls = imageData.results
            .slice(0, 3)
            .map((result: any) => result.urls?.regular)
            .filter((url: string) => url); // Remove null/undefined URLs
        }
      } else {
        console.warn(
          `Unsplash API error: ${imageResponse.status} ${imageResponse.statusText}`,
        );
      }
    } catch (imageError) {
      console.warn("Failed to fetch images from Unsplash:", imageError);
      // Continue without images rather than failing the entire request
    }
    const result = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollectionId,
      ID.unique(),
      {
        tripDetail: JSON.stringify(trip),
        createdAt: new Date().toISOString(),
        imageUrls,
        userId,
      },
    );

    console.log("Trip created successfully with ID:", result.$id);

    return NextResponse.json({
      id: result.$id,
      success: true,
    });
  } catch (err) {
    console.error("Error generating travel plan:", err);
    console.error(
      "Error stack:",
      err instanceof Error ? err.stack : "No stack trace",
    );

    // Return a proper error response
    return NextResponse.json(
      {
        error: "Failed to generate travel plan",
        message: err instanceof Error ? err.message : "Unknown error occurred",
        success: false,
      },
      { status: 500 },
    );
  }
}
