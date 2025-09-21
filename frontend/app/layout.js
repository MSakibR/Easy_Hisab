import "../styles/globals.css";
import SidebarWrapper from "../components/SidebarWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}
