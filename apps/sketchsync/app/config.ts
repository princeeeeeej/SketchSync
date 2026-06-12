export const BACKEND_URL = "http://65.2.148.64:3001"
export const WS_URL = "ws://65.2.148.64:8080"

export const JWT_SECRET = process.env.JWT_SECRET || "65432"

export const isSignedIn = typeof window !== "undefined" && !!localStorage.getItem("token")