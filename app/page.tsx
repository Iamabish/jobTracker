import { ArrowRight, ArrowUpRight, Briefcase, Clock, LucideIcon, LucideProps } from "lucide-react";

interface Itestimonials {
  icon : LucideIcon,
  title : string,
  descrtiptiom : string
}

const testimonials : Itestimonials[] = [
  {
    icon : Briefcase,
    title : "Organize Applications",
    descrtiptiom : 'Create custom boards and columns to track your job applications at every stage of the process.'
  },

  
  {
    icon : ArrowUpRight,
    title : "Track Progress",
    descrtiptiom : 'Monitor your application status from applied to interview to offer with visual Kanban boards.'
  },

  {
    icon : Clock,
    title : "Stay Organized",
    descrtiptiom : 'Never lose track of an application. Keep all your job search information in one centralized place.'
  }
  
]


export default function Home() {
  return <div className="flex min-h-screen items-center justify-center  flex-col bg-white text-black "> 

    <main>
      <section className="container mx-auto py-24 text-center">
        <h1 className="text-2xl md:text-6xl max-w-4xl mx-auto font-bold mb-7">
          A better way to track your job application.
        </h1>

        <p className="text-xl mb-10 font-semibold text-gray-300 max-w-2xl mx-auto">
          Capture, organize, and manage your job search in one place.
        </p>

        <button className="px-4 py-2.5 text-xl font-light bg-pink-400 text-white rounded-lg mx-auto flex items-center gap-3 mb-4 cursor-pointer">
          Start for free
          <ArrowRight className="hover:translate-x-1.5 transition-all ease-in" />
        </button>

        <span className="text-gray-300 font-medium block">
          Free forever. No credit card required.
        </span>
      </section>
  
  <div className="flex gap-3">

    {
      testimonials.map((item, index) => {
        const Icon = item.icon

        return (
          <div className="flex flex-col gap-5 max-w-lg p-2 md:p-4  shadow-lg" key={index} >
            <span className="p-2 bg-pink-100 rounded-xl  w-fit">
              <Icon className="w-5 h-5 text-pink-500" />
            </span>

            <h5 className="text-2xl  font-semibold">
              {item.title}
            </h5>

            <p className="text-gray-500">
              {item.descrtiptiom}
            </p>
          </div>
        )
      })
    }

  </div>

      

    </main>

  </div>
}