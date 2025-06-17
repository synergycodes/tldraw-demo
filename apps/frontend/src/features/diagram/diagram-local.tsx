import { Tldraw } from "tldraw";
import { useMemo } from "react";
import { FamilyMemberShapeUtil } from "./shapes/family-member/family-member-shape-util";
import { TopNavbar } from "../top-navbar/tob-navbar-container";
import { PaletteContainer } from "../palette/palette-container";
import { RightBar } from "../properties-sidebar/properties-sidebar-container";
import { SnackbarContainer } from "../snackbar/snackbar-container";
import { useDiadram } from "./hooks/use-diagram";

export default function DiagramLocal() {
  const { handleMount, components } = useDiadram("local");
  return (
    <Tldraw
      shapeUtils={useMemo(() => [FamilyMemberShapeUtil], [])}
      onMount={handleMount}
      components={components}
    >
      <TopNavbar />
      <PaletteContainer />
      <RightBar />
      <SnackbarContainer />
    </Tldraw>
  );
}
