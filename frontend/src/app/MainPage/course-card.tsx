import Image from 'next/image'

interface CourseCardProps {
  title: string
  type: 'PDF' | 'PPTX' | 'WEBSITE'
  imageUrl: string
}

export function CourseCard({ title, type, imageUrl }: CourseCardProps) {
  return (
    <div className="bg-white overflow-hidden hover:shadow-lg transition-shadow rounded-[16px]">
      <div className="p-0">
        <div className="p-2 pt-2 flex justify-center items-center">
          <div className="w-[85%] h-36 flex justify-center items-center border-2 rounded-[8px]">
            <Image
              src={imageUrl}
              alt={title}
              width={72}
              height={72}
              className="object-contain object-center"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-xs line-clamp-2">{title}</h3>
        </div>
      </div>
    </div>
  )
}
