import useDemoVideoSize from "@/hooks/use-demo-video-size";
import { Skeleton } from "../ui/skeleton";

export default function DemoVideoLoader(){
     const {width, height} = useDemoVideoSize();
     return (
          <Skeleton
               className="flex justify-center items-center"
               style={{
                    width,
                    height,
               }}
               aria-busy
               aria-label="Բեռնվում է տեսանյութը․․․"
          >
               <p className="text-muted-foreground text-lg">Բեռնվում է․․․</p>
          </Skeleton>
     )
}