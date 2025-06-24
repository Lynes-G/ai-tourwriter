import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "./client";
import { redirect } from "next/navigation";

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id)],
    );

    if (total > 0) {
      return documents[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) throw new Error("User not found");

    // Check if user already exists in database
    const existingUser = await getExistingUser(user.$id);
    if (existingUser) {
      console.log("User already exists in database, returning existing user");
      return existingUser;
    }

    const { providerAccessToken } = (await account.getSession("current")) || {};
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;
    const userData = {
      name: user.name,
      email: user.email,
      accountId: user.$id,
      joinedAt: new Date().toISOString(),
      imageUrl: profilePicture || "",
      status: "user", // Default status for new users
    };

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      userData,
    );

    if (!createdUser.$id) {
      redirect("/sign-in");
    }

    return createdUser;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error; // Re-throw to let calling function handle it
  }
};

const getGooglePicture = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) throw new Error("Failed to fetch Google profile picture");

    const { photos } = await response.json();
    return photos?.[0]?.url || null;
  } catch (error) {
    console.error("Error fetching Google picture:", error);
    return null;
  }
};

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/sign-in`,
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

export const logoutUser = async () => {
  try {
    console.log("🚪 Logging out user...");
    await account.deleteSession("current");
    console.log("✅ User logged out successfully");
  } catch (error) {
    console.error("❌ Error during logout:", error);
    throw error; // Re-throw so the calling component can handle it
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) return redirect("/sign-in");

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ],
    );

    return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const checkAuthStatus = async () => {
  try {
    // First check if there's an active session
    const session = await account.getSession("current");
    if (!session) {
      return { authenticated: false, user: null };
    }

    // Then get user info
    const user = await account.get();
    if (!user) {
      return { authenticated: false, user: null };
    }

    return { authenticated: true, user };
  } catch (error) {
    return { authenticated: false, user: null };
  }
};

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: user, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.limit(limit), Query.offset(offset)],
    );

    if (total === 0) return { users: [], total: 0 };
    return { users: user, total };
  } catch (err) {
    console.log("Error fetching all users:", err);
  }
};
