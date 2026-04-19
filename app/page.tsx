import ActiveTabs from "@/components/activeTabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Briefcase, Clock, LucideIcon, LucideProps, TrendingUp } from "lucide-react";
import Link from "next/link";


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
    icon : TrendingUp,
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
  return <div className="flex min-h-screen items-center justify-center    flex-col bg-white text-black "> 

    <main>
      <section className="container mx-auto py-24 text-center">

        <h1 className="text-2xl md:text-6xl max-w-4xl mx-auto font-bold mb-7">
          A better way to track your job application.
        </h1>

        <p className="text-xl mb-10 font-semibold text-muted-foreground max-w-2xl mx-auto">
          Capture, organize, and manage your job search in one place.
        </p>


        <Link href={'/signup'}>
          <Button size={"lg"}   className=" py-5 h-12 px-8  text-xl font-light bg-pink-400 text-white rounded-lg mx-auto flex items-center gap-3 mb-4 cursor-pointer group">
            Start for free
            <ArrowRight className="transition-all ease-in group-hover:translate-x-1.5" />
          </Button>
        </Link>

        <span className="text-muted-foreground font-medium block">
          Free forever. No credit card required.
        </span>
      </section>


      <section className="border py-20 px-3 flex-col gap-10   rounded-md w-full flex items-center justify-center mb-10">

        <ActiveTabs />
  
      </section>
  

      <section className="border py-20 px-3 flex-col gap-10   rounded-md w-full  flex items-center justify-center mb-10">

          <div className="flex gap-3 items-center justify-between">

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

      </section>
  

      

    </main>

  </div>
}