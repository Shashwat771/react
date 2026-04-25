/**
 * Development-only authentication bypass for localhost
 * This allows testing without Firebase domain authorization
 */

export const devSignInWithGoogle = async () => {
  // Simulate a Google user for development
  const mockUser = {
    displayName: "Dev User",
    email: "dev.user@example.com",
    uid: "dev-user-123",
    photoURL: null
  };

  console.warn("⚠️ Using MOCK Google Sign-In (development only)");
  
  return {
    user: mockUser
  };
};

export const isDevelopment = () => {
  return window.location.hostname === "localhost" || 
         window.location.hostname === "127.0.0.1";
};
