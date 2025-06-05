import { useIsMobile } from "./use-mobile";

export default function useDemoVideoSize() : number {
     const isMobile = useIsMobile();
     return isMobile ? 270 : 350;
}