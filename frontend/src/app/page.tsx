import { Mic, Paperclip, Send } from 'lucide-react'

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-16 text-center bg-[#EFF2FF]">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 max-w-3xl">
        START LEARNING SMARTER TODAY
      </h1>
      
      <div className="w-full max-w-3xl relative">
        <div className="flex items-center gap-2 p-2 rounded-full border bg-white">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Mic className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Upload pdf, pptx, articles or paste youtube videos"
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
          />
          <button className="p-2 rounded-full bg-[#6366F1] text-white hover:bg-[#5558E3]">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mt-4">
        Supported Format : PDF, PPTX, TXT, JPEG or Youtube Videos
      </p>
    </section>
  );
}
