"use client";
import { BACKEND_URL } from "@/app/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AuthPage = ({ isSignIn }: { isSignIn: boolean }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handler = async () => {
    const response = await fetch(
      `${BACKEND_URL}/${isSignIn ? "signin" : "signup"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(isSignIn ? {} : { username }),
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E1E2E] via-[#2A2A3C] to-[#181825] p-6">
      <div className="w-full max-w-6xl h-[600px] flex rounded-[30px] overflow-hidden shadow-lg">
        <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
          <div className="flex flex-col gap-10 w-full max-w-sm">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Welcome Back!</h1>
              <p className="text-sm text-gray-500 mt-2">
                Real-time whiteboarding for modern teams.<br/> Get started for free
              </p>
            </div>

            <div className="flex flex-col gap-3 px-10">
              {!isSignIn && (
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-full border px-4 py-2"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full border px-4 py-2"
              />

              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full border px-4 py-2"
              />

              <button
                onClick={handler}
                className="rounded-full bg-black text-white py-2 mt-2"
              >
                {isSignIn ? "Sign In" : "Sign Up"}
              </button>
            </div>

            <div className="text-center text-sm">
              Not a member?{" "}
              <Link href="/signup" className="text-blue-500">
                Register now
              </Link>
            </div>

          </div>
        </div>
        <div className="w-1/2 h-full">
          {isSignIn ? (
            <img
            src="/login.jpg"
            alt="login"
            className="w-full h-full object-cover"
          /> 
          ) : (
            <img
            src="/signup.jpg"
            alt="signup"
            className="w-full h-full object-cover"
          />
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthPage;