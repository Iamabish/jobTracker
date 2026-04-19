"use client"

import { Button } from "./ui/button";
import Image from "next/image";

import { useState } from "react"

enum TAB {
    ORGANIZE = "ORGANIZE",
    HIRED = "HIRED",
    MANAGE = "MANAGE",

}

const tabContent = {
    [TAB.ORGANIZE] : {
        image : '/hero-images/hero1.png',
        title : 'organize',
    },
    [TAB.HIRED] : {
        image : "/hero-images/hero2.png",
        title : 'hired',

    },

    [TAB.MANAGE] : {
        image : "/hero-images/hero3.png",
        title : 'manage',

    }
}

export default function ActiveTabs (){

    const [activeTab, setActiveTab] = useState<TAB>(TAB.ORGANIZE)

    const currentTab = tabContent[activeTab]

    return <div className="flex flex-col gap-10">


        <div className="flex items-center gap-5  justify-center ">

            {Object.values(TAB).map((tab) => (
                <Button
                key={tab}
                size={"lg"}
                onClick={() => setActiveTab(tab)}
                className={`${activeTab === tab ? "bg-black text-white" : "bg-white text-black"} px-3 py-3.5 rounded-lg cursor-pointer`}
                >
                    {tab}
                </Button>
            ))}
          
        </div>


      <div className="border rounded-md shadow-xl  h-120  w-full overflow-hidden" >
  
        <Image 
        src={currentTab.image}
        width={1200}
        height={800}
        alt={currentTab.title}
        />

      </div>


      <div>
        
      </div>
    </div>


}