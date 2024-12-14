// app/community/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase"; // Centralized Firebase initialization
import  Header  from "../MainPage/header";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "notes"));
        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [db]);

  // Optimize filtering with useMemo
  const filteredNotes = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerCaseQuery) ||
        note.labels.some((label) => label.toLowerCase().includes(lowerCaseQuery))
    );
  }, [notes, searchQuery]);

  return (
    <div className="bg-[#E5EBFF] min-h-screen">
      {/* Header and Navigation - No changes needed */}
      <Header/>

      <main className="container mx-auto px-4 py-8">
        {/* Title and Description - No changes needed */}
        <div className="text-center mb-8">
        <h1 className="text-4xl font-roboto font-bold text-gray-800 mb-2">
          Community Notes
        </h1>
          <p className="text-gray-600">
            Explore and learn from notes shared by other students
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8 w-full max-w-md mx-auto relative group">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
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
            className="w-full pl-10 pr-4 py-3 border-0 rounded-xl 
            bg-white/80 backdrop-blur-sm shadow-lg
            text-gray-700 placeholder-gray-400
            transition-all duration-300 ease-in-out
            hover:bg-white/90 hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus: none
            focus:bg-white focus:shadow-md"
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
            <p className="text-gray-600 text-lg">
              No notes found matching your search.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Improved Note Card with Link Component */}
            {filteredNotes.map((note) => (
              <Link
                href={`/community/notes/${note.id}`}
                key={note.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full border border-gray-100"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                    {note.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.labels.map((label) => (
                      <span
                        key={label}
                        className="bg-[#AEB4FF] text-[#0A0C1C] px-3 py-1 rounded-full text-sm font-medium hover:bg-[#C2C7FF] transition-colors"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  {/* Optimized Markdown Preview */}
                  <ReactMarkdown
                    className="prose prose-sm text-gray-600 line-clamp-3 mt-2 max-w-none"
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Hide headers and optimize other elements for preview
                      h1: () => null,
                      h2: () => null,
                      h3: () => null,
                      h4: () => null,
                      h5: () => null,
                      h6: () => null,
                      p: ({ children }) => (
                        <p className="text-gray-600 mb-2 last:mb-0">
                          {children}
                        </p>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {note.text.substring(0, 300)}
                  </ReactMarkdown>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="ml-auto">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
