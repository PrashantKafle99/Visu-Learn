"use client";

import { useState } from "react";

export function SnapLearnInterface() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-200 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-60 left-1/3 w-12 h-12 bg-purple-200 rounded-full opacity-30 animate-bounce-gentle"></div>
      </div>

      {/* Header */}
      <header className="py-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300"
            >
              <span className="text-2xl">←</span>
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-purple-800 font-[var(--font-fredoka)]">
                📸 Snap & Learn
              </h1>
              <p className="text-lg text-purple-600">
                Capture the world around you and discover amazing facts!
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-purple-500 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-8 animate-bounce-gentle shadow-2xl">
            📸
          </div>
          <h2 className="text-2xl font-bold text-purple-800 mb-4 font-[var(--font-fredoka)]">
            Ready to explore?
          </h2>
          <p className="text-purple-600 mb-8 max-w-md mx-auto">
            Choose how you&apos;d like to capture an image and start your learning
            adventure!
          </p>
        </div>
      </main>

      {/* Image Upload Modal - TODO: Implement modal component */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Upload Image</h3>
            <p className="mb-4">Image upload functionality coming soon!</p>
            <button 
              onClick={() => setShowModal(false)}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
