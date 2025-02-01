import { useMediaQuery } from "react-responsive";

function CursorSvg() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)' })
  return (
    <>
      <img 
        width={isTabletOrMobile ? 85 : 80}
        height={isTabletOrMobile ? 85 : 80}
      src={`${new URL("../assets/cursor/MicrorestCursor.svg", import.meta.url).href}`} alt="" />
    </>
  );
}

export default CursorSvg;
