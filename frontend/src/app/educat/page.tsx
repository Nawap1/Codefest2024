import Header from '../MainPage/header';
import { Hero } from '../MainPage/hero';
import { Community } from '../MainPage/community';

function EduCat() {
  return (
    <div className="min-h-screen bg-[#EFF2FF] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          className="absolute top-0 left-0 opacity-[0.05]"
        >
          <defs>
            <pattern 
              id="pattern" 
              width="80" 
              height="80" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M0 0 L40 0 Q80 0, 80 40 L80 80 Q40 80, 0 40 Z" 
                fill="none" 
                stroke="#5661F6" 
                strokeWidth="0.5" 
                opacity="0.1"
              />
              <circle 
                cx="40" 
                cy="40" 
                r="2" 
                fill="#6366F1" 
                opacity="0.1"
              />
            </pattern>
          </defs>
          <rect 
            width="100%" 
            height="100%" 
            fill="url(#pattern)"
          />
        </svg>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EFF2FF]/20 to-[#6366F1]/10"></div>

        {/* Floating Shapes */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#5661F6]/10 rounded-full blur-2xl"></div>
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Community />
      </div>
    </div>
  )
}

export default EduCat;