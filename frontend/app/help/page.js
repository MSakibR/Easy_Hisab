"use client";

import { useState, useRef, useEffect } from "react";

export default function HelpCenterPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm here to help you with your invoice management questions. What can I assist you with today?",
      isUser: false,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [typing, setTyping] = useState(false);

  const chatContainerRef = useRef();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, typing]);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = { id: Date.now(), text: chatInput, isUser: true };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const botMessage = {
        id: Date.now() + 1,
        text: getBotResponse(userMessage.text),
        isUser: false,
      };
      setChatMessages((prev) => [...prev, botMessage]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("invoice") && msg.includes("create")) {
      return "To create an invoice, click the 'New Invoice' button, fill in client details and line items, then generate the invoice.";
    } else if (msg.includes("tax")) {
      return "You can configure automatic tax rates under Settings > Tax Configuration.";
    } else {
      return "I'm here to help! Could you please clarify your question?";
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const [contactOpen, setContactOpen] = useState(false);
  const openContactModal = () => setContactOpen(true);
  const closeContactModal = () => setContactOpen(false);
  const submitContactForm = (e) => {
    e.preventDefault();
    alert("Message sent!");
    closeContactModal();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
              <p className="text-gray-600">
                Invoice Management & Tax Automation
              </p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            💬 Chat Support
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              How can we help you today?
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles, features, or common issues..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none shadow-lg"
              />
              <svg
                className="absolute right-4 top-4 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <ActionCard
            title="Getting Started"
            color="blue"
            icon="🚀"
            onClick={() => scrollToSection("getting-started")}
            description="Learn the basics of invoice management"
          />
          <ActionCard
            title="Tax Automation"
            color="green"
            icon="🧮"
            onClick={() => scrollToSection("tax-automation")}
            description="Understand automated tax calculations"
          />
          <ActionCard
            title="Troubleshooting"
            color="red"
            icon="🔧"
            onClick={() => scrollToSection("troubleshooting")}
            description="Fix common issues quickly"
          />
          <ActionCard
            title="Contact Support"
            color="purple"
            icon="✉️"
            onClick={openContactModal}
            description="Get personalized help from our team"
          />
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Video Tutorials */}
        <VideoTutorials />

        {/* Contact Options */}
        <ContactOptions openChat={toggleChat} openModal={openContactModal} />
      </main>

      {/* Chat Widget */}
      {chatOpen && (
        <ChatWidget
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          sendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          typing={typing}
          chatContainerRef={chatContainerRef}
          toggleChat={toggleChat}
        />
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <ContactModal close={closeContactModal} submit={submitContactForm} />
      )}
    </div>
  );
}

// Reusable Components

function ActionCard({ title, description, color, icon, onClick }) {
  const colors = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
  };
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
      onClick={onClick}
    >
      <div
        className={`${colors[color].bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
      >
        <span className={`text-xl`}>{icon}</span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="faq-section" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Frequently Asked Questions
      </h2>
      {/* Example FAQs */}
      <div id="getting-started" className="mb-8">
        <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
          <span className="bg-blue-100 p-2 rounded-lg mr-3">🚀</span> Getting
          Started
        </h3>
        <FAQItem
          question="How do I create my first invoice?"
          answer="Click 'New Invoice', fill in the details, and save. You can add multiple line items and apply taxes automatically."
        />
        <FAQItem
          question="Can I customize invoice templates?"
          answer="Yes! Go to Settings > Invoice Templates to customize colors, fonts, and logos."
        />
      </div>
      <div id="tax-automation">
        <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
          <span className="bg-green-100 p-2 rounded-lg mr-3">🧮</span> Tax
          Automation
        </h3>
        <FAQItem
          question="How is tax calculated automatically?"
          answer="Taxes are calculated based on your business location and the client location. You can also configure tax rates manually."
        />
        <FAQItem
          question="Can I apply multiple taxes?"
          answer="Yes! You can add multiple tax rules and apply them to invoices automatically."
        />
      </div>
      <div id="troubleshooting">
        <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
          <span className="bg-red-100 p-2 rounded-lg mr-3">🔧</span>{" "}
          Troubleshooting
        </h3>
        <FAQItem
          question="What should I do if an invoice is missing?"
          answer="Check if it was saved in Drafts or Archived. If not, contact support."
        />
        <FAQItem
          question="Why is tax not applied correctly?"
          answer="Check your tax configuration in Settings > Tax Configuration and ensure it matches client location."
        />
      </div>
    </section>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex justify-between items-center font-medium text-gray-700"
      >
        {question} <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && <p className="mt-2 text-gray-600">{answer}</p>}
    </div>
  );
}

function VideoTutorials() {
  return (
    <section id="video-tutorials" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Video Tutorials
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <iframe
            className="w-full h-48"
            src="https://www.youtube.com/watch?v=nzTSBIlwCjk"
            title="Video 1"
            allowFullScreen
          ></iframe>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Creating Your First Invoice
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <iframe
            className="w-full h-48"
            src="https://www.youtube.com/watch?v=nzTSBIlwCjk"
            title="Video 2"
            allowFullScreen
          ></iframe>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Automating Taxes
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <iframe
            className="w-full h-48"
            src="https://www.youtube.com/watch?v=nzTSBIlwCjk"
            title="Video 3"
            allowFullScreen
          ></iframe>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Troubleshooting Common Issues
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactOptions({ openChat, openModal }) {
  return (
    <section id="contact-options" className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Need More Help?</h2>
      <div className="flex justify-center space-x-6">
        <button
          onClick={openChat}
          className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition"
        >
          Chat with Support
        </button>
        <button
          onClick={openModal}
          className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition"
        >
          Contact via Email
        </button>
      </div>
    </section>
  );
}

// Chat Widget Component
function ChatWidget({ chatMessages, chatInput, setChatInput, sendMessage, handleKeyPress, typing, chatContainerRef, toggleChat }) {
  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">💬 Support Chat</h3>
        <button onClick={toggleChat} className="text-white text-xl hover:text-gray-200">×</button>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-2xl max-w-xs break-words ${
              msg.isUser ? "bg-blue-500 text-white ml-auto" : "bg-white text-gray-800"
            } shadow`}
          >
            {msg.text}
          </div>
        ))}
        {typing && <div className="text-gray-500">Typing...</div>}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex space-x-2 bg-white">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// Contact Modal Component
function ContactModal({ close, submit }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Slight blur background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Modal Content */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl w-full max-w-md p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-700"
        >
          ×
        </button>

        {/* Modal Content */}
        <h3 className="text-2xl font-bold mb-6 text-center">Contact Support</h3>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Your Message"
            required
            className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <div className="flex justify-end space-x-3 mt-2">
            <button
              type="button"
              onClick={close}
              className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>

  );
}

