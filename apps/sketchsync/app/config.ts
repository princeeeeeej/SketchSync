export const BACKEND_URL = "http://localhost:3001"
export const WS_URL = "ws://localhost:8080"

export const JWT_SECRET = process.env.JWT_SECRET || "65432"

export const isSignedIn = typeof window !== "undefined" && !!localStorage.getItem("token")