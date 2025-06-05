import useDemoVideoSize from "@/hooks/use-demo-video-size";
import { Skeleton } from "../ui/skeleton";

export default function DemoVideoLoader(){
     const size = useDemoVideoSize();
     return (
          <Skeleton className="flex justify-center items-center" style={{
               width: `${size}px`,
               height: `${size}px`
          }}>
               <p className="text-muted-foreground text-lg">Բեռնվում է․․․</p>
          </Skeleton>
     )
}