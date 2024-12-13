import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import notesData from '../../data/notes.json';

// Generate static params at build time
export async function generateStaticParams() {
  return notesData.notes.map((note) => ({
    id: note.id.toString(),
  }));
}

// This is now a Server Component by default (remove "use client")
export default function NotePage({ params }: { params: { id: string } }) {
  const note = notesData.notes.find(n => n.id === Number(params.id));

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/community" className="text-blue-600 hover:underline mb-6 block">
        <span className="inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Community Notes
        </span>
      </Link>

      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{note.title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {note.labels.map((label, index) => (
            <span
              key={index}
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {label}
            </span>
          ))}
        </div>

        <ReactMarkdown
        className="prose prose-blue max-w-none"
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-2" {...props} />,
        }}
      >
        {note.text}
      </ReactMarkdown>
      </div>
    </div>
  );
}