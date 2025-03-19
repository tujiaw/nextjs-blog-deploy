import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-1 pb-4 pt-3 md:space-y-2">
          <h1 className="text-2xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-9 md:text-5xl md:leading-12">
            Projects
          </h1>
          <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
            A collection of my work-in-progress projects
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
