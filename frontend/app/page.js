"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access"); // get JWT token

    if (!token) {
      router.push("/auth");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessage(res.data.message);
        setLoading(false);

        // ✅ Wait 5 seconds before routing to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("access");
        router.push("/auth");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500">Checking login status...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-screen w-screen gradient-bg flex items-center justify-center overflow-hidden z-0">
      {/* Floating Background Shapes */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Main Compressed Card */}
      <div className="relative z-10 w-[85%] sm:w-[400px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 text-center scale-95 translate-x-20">
        {/* Logo Section */}
        <div className="relative flex justify-center mb-6">
          <div className="pulse-ring absolute w-48 h-48 bg-white/20 rounded-full"></div>
          <img
            src="/EH.png"
            alt="Easy Hisab Logo"
            className="main-logo w-40 h-40 object-contain relative z-10 animate-fadeIn"
          />
        </div>
        {/* Brand Name */}
        <h1 className="brand-text text-4xl font-bold text-white mb-3">
          Easy Hisab
        </h1>
        {/* Tagline */}
        <p className="tagline text-blue-100 mb-8 text-base">
          Smart Business Management Solution
        </p>
        {/* Loading Dots */}
        <div className="loading-dots">
          <div className="flex justify-center space-x-2">
            <div className="loading-dot w-3 h-3 bg-white rounded-full"></div>
            <div className="loading-dot w-3 h-3 bg-white rounded-full"></div>
            <div className="loading-dot w-3 h-3 bg-white rounded-full"></div>
          </div>
          <p className="text-blue-100 mt-4 text-sm">
            {loading ? "Loading your business dashboard..." : "Redirecting..."}
          </p>
        </div>
        {/* Version */}
        <p className="version-text mt-8 text-blue-200 text-xs">Version 1.0.0</p>
      </div>

      {/* Styles */}
      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
        }

        .shape:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }

        .shape:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 70%;
          right: 10%;
          animation-delay: 3s;
        }

        .shape:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 15%;
          left: 25%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .main-logo {
          animation: fadeIn 1.5s ease-in-out forwards;
        }

        .pulse-ring {
          animation: pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955)
            infinite;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        .loading-dot {
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .loading-dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        .loading-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .brand-text,
        .tagline,
        .loading-dots,
        .version-text {
          opacity: 0;
          animation: fadeInText 1.5s ease-out forwards;
        }

        .brand-text {
          animation-delay: 0.5s;
        }

        .tagline {
          animation-delay: 1s;
        }

        .loading-dots {
          animation-delay: 1.5s;
        }

        .version-text {
          animation-delay: 2s;
        }

        @keyframes fadeInText {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
