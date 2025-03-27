import { FEATURES } from "@/data/constants/landing-page";

export default function Features(){
     return (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-6 max-w-[1750px] my-8">
               {FEATURES.map(({id,name,description,Icon})=>(
                    <li key={id} className="p-4 space-y-2">
                         <div className="w-16 h-16 aspect-square bg-primary p-[10px] rounded-xl mb-[10px]"><Icon className="w-full h-full aspect-square text-primary-foreground"/></div>
                         <h2 className="text-3xl font-semibold">{name}</h2>
                         <p className="">{description}</p>
                    </li>
               ))}
          </ul>
     )
}