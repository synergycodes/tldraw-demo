export function Background() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor:
          "var(--xy-canvas-background-color, var(--wb-colors-gray-200))",
        zIndex: 0,
      }}
    />
  );
}
