function CursorSvg() {
  return (
    <>
      <img 
        width={80}
        height={80}
      src={`${new URL("../assets/cursor/MicrorestCursor.svg", import.meta.url).href}`} alt="" />
    </>
  );
}

export default CursorSvg;
