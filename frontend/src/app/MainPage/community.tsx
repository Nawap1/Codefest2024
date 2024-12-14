import { CourseCard } from './course-card'

export function Community() {
  const courses = [
    {
      title: "What is Blockchain and Artificial Intelligence (AI)?",
      type: "PPTX" as const,
      imageUrl: "/pptx.png",
    },
    {
      title: "How to turn anxiety into your ally, not your enemy",
      type: "PDF" as const,
      imageUrl: "/pdf.png",
    },
    {
      title: "Learn the Basics of UI/UX",
      type: "PDF" as const,
      imageUrl: "/pdf.png",
    },
    {
      title: "AICS 301: COMPUTER NETWORKS AND CYBERSECURITY",
      type: "WEBSITE" as const,
      imageUrl: "/website.png",
    }
  ]

  return (
    <section className="px-6 py-0">
      <h2 className="text-3xl font-bold text-center mb-8">
        EXPLORE OUR COMMUNITY
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {courses.map((course, index) => (
          <CourseCard 
            key={index} 
            {...course} 
            imageClassName="object-contain object-center w-[1px] h-[1px]"
          />
        ))}
      </div>
    </section>
  )
}
