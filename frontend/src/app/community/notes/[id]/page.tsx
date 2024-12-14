// app/community/notes/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase"; // Centralized Firebase initialization

export default function NotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<{
    id: string;
    title: string;
    labels: string[];
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "notes", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNote({ id: docSnap.id, ...docSnap.data() });
        } else {
          setNote(null); // Explicitly set note to null if not found
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        setNote(null); // Handle error by setting note to null
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [params.id, db]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex justify-center items-center h-screen">
        Note not found
      </div>
    );
  }

  return (
    <div className="px-6 py-8 ">
      <Link
        href="/community"
        className="text-blue-600 hover:underline mb-6 block max-w-6xl mx-auto"
      >
        <span className="inline-flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          Back to Community Notes
        </span>
      </Link>

      <div className="bg-white overflow-hidden hover:shadow-lg transition-shadow rounded-[16px] max-w-6xl mx-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{note.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {note.labels.map((label) => (
              <span
                key={label}
                className="bg-[#AEB4FF] text-[#0A0C1C] px-3 py-1 rounded-full text-sm"
              >
                {label}
              </span>
            ))}
          </div>

          <ReactMarkdown
            className="prose prose-blue max-w-none text-sm"
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mb-2">{children}</h3>
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
            {note.text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}