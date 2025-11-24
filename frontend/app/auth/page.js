"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";


export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    password: "",
    confirm_password: "",
  });

  const showLogin = () => setIsLogin(true);
  const showSignup = () => setIsLogin(false);

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || data.error || "Login failed");
        return;
      }

      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);

      // Optional: store user info if needed
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(data.message || "Login successful!");
      router.push("/"); // redirect to landing page
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: signupData.first_name,
          last_name: signupData.last_name,
          email: signupData.email,
          phone_number: signupData.phone_number, // fixed
          company_name: signupData.company_name, // fixed
          password: signupData.password,
          confirm_password: signupData.confirm_password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show the first validation error returned by DRF
        const firstError =
          data.first_name?.[0] ||
          data.last_name?.[0] ||
          data.email?.[0] ||
          data.phone_number?.[0] ||
          data.company_name?.[0] ||
          data.password?.[0] ||
          data.confirm_password?.[0] ||
          "Signup failed";
        toast.error(firstError);
        return;
      }

      toast.success(data.message);
      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);
  
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/"); // redirect to landing page
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };


  //const loginWithGoogle = () => toast("Google Login clicked");
  //const signupWithGoogle = () => toast("Google Signup clicked");

  return (
    <div className="h-screen relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Floating Shapes */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white/20 animate-float`}
            style={{
              width: `${50 + i * 30}px`,
              height: `${50 + i * 30}px`,
              top: `${15 + i * 20}%`,
              left: `${10 + i * 20}%`,
              animationDelay: `${i * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="h-screen flex relative z-10">
        {/* Left Panel */}
        <div className="w-1/2 right-panel flex flex-col items-center justify-center p-8 text-white bg-gradient-to-br from-purple-500 to-indigo-500 relative">
          <div className="text-center z-10">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl mx-auto mb-8 flex items-center justify-center">
              <img
                src="/EH.png" // <-- replace with your image file name in public folder
                alt="EH Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold mb-4">Easy Hisab</h1>
            <p className="text-xl text-blue-100 mb-8">
              Smart Business Management Solution
            </p>

            {/* Features */}
            <div className="space-y-4 text-left max-w-md">
              {[
                "Invoice Management",
                "Customer Management",
                "Financial Reports",
                "Multi-language Support",
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-blue-100">{feature}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p className="text-blue-100 text-sm mt-12">
              © 2024 Easy Hisab. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 left-panel flex flex-col items-center justify-center p-8">
          {/* Toggle Buttons */}
          <div className="bg-gray-100 rounded-2xl p-2 mb-6 relative w-full max-w-md">
            <div className="flex relative">
              <div
                className={`absolute top-0 left-0 w-1/2 h-full bg-blue-600 rounded-xl shadow-lg transition-transform duration-300 ${
                  !isLogin ? "translate-x-full" : ""
                }`}
              ></div>
              <button
                className="relative z-10 w-1/2 py-3 text-center font-medium"
                onClick={showLogin}
              >
                Login
              </button>
              <button
                className="relative z-10 w-1/2 py-3 text-center font-medium"
                onClick={showSignup}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Forms */}
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md form-container">
            {/* Login Form */}
            {isLogin && (
              <form className="space-y-4" onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
                <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md">
                  Sign In
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await fetch(
                        "http://localhost:8000/api/google-login/",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            token: credentialResponse.credential,
                          }), // ID token
                        }
                      );

                      const data = await res.json();
                      if (!res.ok) {
                        toast.error(data.error || "Google login failed");
                        return;
                      }

                      toast.success("Login successful!");
                      localStorage.setItem("access", data.tokens.access);
                      localStorage.setItem("refresh", data.tokens.refresh);
                      localStorage.setItem("user", JSON.stringify(data.user)); // optional
                      localStorage.setItem(
                        "refresh_token",
                        data.tokens.refresh
                      );
                      localStorage.setItem("user", JSON.stringify(data.user));
                      router.push("/");
                    } catch (error) {
                      console.error(error);
                      toast.error("Something went wrong with Google login!");
                    }
                  }}
                  onError={() => toast.error("Google login failed")}
                  useOneTap
                />
              </form>
            )}

            {/* Signup Form */}
            {!isLogin && (
              <form className="space-y-3" onSubmit={handleSignup}>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={signupData.first_name}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        first_name: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={signupData.last_name}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        last_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={signupData.phone_number}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        phone_number: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={signupData.company_name}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        company_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={signupData.confirm_password}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirm_password: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <span className="ml-2 text-xs text-gray-600">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  Create Account
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await fetch(
                        "http://localhost:8000/api/google-signup/",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            token: credentialResponse.credential,
                          }), // ID token
                        }
                      );

                      const data = await res.json();
                      if (!res.ok) {
                        toast.error(data.error || "Google login failed");
                        return;
                      }

                      toast.success("Login successful!");
                      localStorage.setItem("access", data.tokens.access);
                      localStorage.setItem("refresh", data.tokens.refresh);

                      localStorage.setItem("user", JSON.stringify(data.user));
                      router.push("/");
                    } catch (error) {
                      console.error(error);
                      toast.error("Something went wrong with Google login!");
                    }
                  }}
                  onError={() => toast.error("Google login failed")}
                  useOneTap
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
