"use client";
import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import notesData from "./data/notes.json";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredNotes = notesData.notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.labels.some((label) =>
        label.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white py-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/">
              <span className="text-blue-600 hover:text-blue-800 font-bold text-xl transition-colors">
                Study Notes App
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/community">
                <span className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  Community Notes
                </span>
              </Link>
              {/* Add more nav items as needed */}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Community Notes
          </h1>
          <p className="text-gray-600">
            Explore and learn from notes shared by other students
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8 w-full max-w-md mx-auto relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search notes by title or label..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notes Grid with Loading and Empty States */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-lg shadow-lg p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No notes found matching your search.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Link href={`/community/notes/${note.id}`} key={note.id}>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full border border-gray-100 hover:border-blue-500">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      {note.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.labels.map((label, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <ReactMarkdown
                      className="prose prose-sm text-gray-600 line-clamp-3 mt-2 max-w-none"
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="text-gray-600 mb-2 last:mb-0">{children}</p>
                        ),
                        a: ({ children }) => (
                          <span className="text-blue-600 hover:underline">{children}</span>
                        ),
                        // Hide headers in preview
                        h1: () => <></>,
                        h2: () => <></>,
                        h3: () => <></>,
                        h4: () => <></>,
                        h5: () => <></>,
                        h6: () => <></>,
                      }}
                    >
                      {note.text.substring(0, 300)}
                    </ReactMarkdown>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span className="ml-auto">Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}