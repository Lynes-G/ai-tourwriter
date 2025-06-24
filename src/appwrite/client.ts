import { Account, Client, Databases, Storage } from "appwrite";

export const appwriteConfig = {
  endpointUrl:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    "https://fra.cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "default",
  apiKey: process.env.NEXT_PUBLIC_APPWRITE_API_KEY || "default",
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "default",
  userCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "default",
  tripsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_TRIPS_COLLECTION_ID || "default",
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage };

// Debug function to check configuration
/* export const debugAppwriteConfig = () => {
  console.log("🔧 Current Appwrite Configuration:");
  console.log("📍 Endpoint:", appwriteConfig.endpointUrl);
  console.log("🆔 Project ID:", appwriteConfig.projectId);
  console.log("🗄️ Database ID:", appwriteConfig.databaseId);
  console.log("👤 User Collection ID:", appwriteConfig.userCollectionId);
  console.log("✈️ Trips Collection ID:", appwriteConfig.tripsCollectionId);

  // Check if any values are still "default" (meaning env var not found)
  const missingEnvVars = [];
  if (appwriteConfig.projectId === "default")
    missingEnvVars.push("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  if (appwriteConfig.databaseId === "default")
    missingEnvVars.push("NEXT_PUBLIC_APPWRITE_DATABASE_ID");
  if (appwriteConfig.userCollectionId === "default")
    missingEnvVars.push("NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID");

  if (missingEnvVars.length > 0) {
    console.error("❌ Missing environment variables:", missingEnvVars);
    console.error("📝 Please check your .env.local file");
  } else {
    console.log("✅ All environment variables are loaded");
  }

  return appwriteConfig;
};
 */
