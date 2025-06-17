import { Tldraw } from "tldraw";
import { useMemo } from "react";
import { FamilyMemberShapeUtil } from "./shapes/family-member/family-member-shape-util";
import { TopNavbar } from "../top-navbar/tob-navbar-container";
import { PaletteContainer } from "../palette/palette-container";
import { RightBar } from "../properties-sidebar/properties-sidebar-container";
import { SnackbarContainer } from "../snackbar/snackbar-container";
import { useDiadram } from "./hooks/use-diagram";
import { useSyncDemo } from "@tldraw/sync";
import { useSyncedRoomId } from "@/hooks/use-synced-room-id";

export default function DiagramSyncDemo() {
  const roomId = useSyncedRoomId();
  const { handleMount, components } = useDiadram("sync-demo");

  const store = useSyncDemo({
    roomId,
    shapeUtils: useMemo(() => [FamilyMemberShapeUtil], []),
  });

  return (
    <Tldraw
      store={store}
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
