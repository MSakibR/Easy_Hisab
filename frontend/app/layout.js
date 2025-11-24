"use client";

import "../styles/globals.css";
import SidebarWrapper from "../components/SidebarWrapper";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useEffect, useState } from "react";

function LayoutContent({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only check login on client
    if (pathname !== "/auth") {
      const token = localStorage.getItem("access");
      if (!user && !token) {
        router.push("/auth");
      } else {
        setLoading(false); // token exists → show content
      }
    } else {
      setLoading(false); // on /auth page → show content
    }
  }, [user, pathname, router]);

  if (loading) {
    return <p className="text-center mt-20">Checking login...</p>;
  }

  // If on login page → show only children
  if (pathname === "/auth") {
    return children;
  }

  // Logged in → show sidebar + content
  return <SidebarWrapper>{children}</SidebarWrapper>;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <GoogleOAuthProvider clientId="857762176087-rj8j3odt8g5ecqqr14ltvpfgdri3rskt.apps.googleusercontent.com">
          <AuthProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
