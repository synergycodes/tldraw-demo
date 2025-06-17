import { defaultShapeUtils, TLAssetStore, Tldraw, uniqueId } from "tldraw";
import { useMemo } from "react";
import { FamilyMemberShapeUtil } from "./shapes/family-member/family-member-shape-util";
import { TopNavbar } from "../top-navbar/tob-navbar-container";
import { PaletteContainer } from "../palette/palette-container";
import { RightBar } from "../properties-sidebar/properties-sidebar-container";
import { SnackbarContainer } from "../snackbar/snackbar-container";
import { useDiadram } from "./hooks/use-diagram";
import { useSync } from "@tldraw/sync";
import { useSyncedRoomId } from "@/hooks/use-synced-room-id";

export default function DiagramRemote() {
  const roomId = useSyncedRoomId();
  const url = new URL(window.location.href);
  const readOnly = url.searchParams.get("readOnly");
  const store = useSync({
    uri: `${import.meta.env.VITE_API_URL}/connect/${roomId}${readOnly ? `?readOnly=${readOnly}` : ''}`,
    assets: multiplayerAssets,
    shapeUtils: useMemo(
      () => [FamilyMemberShapeUtil, ...defaultShapeUtils],
      []
    ),
  });
  window.store = store
  const { handleMount, components } = useDiadram("remote");
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

const multiplayerAssets: TLAssetStore = {
  async upload(_asset, file) {
    const id = uniqueId();

    const objectName = `${id}-${file.name}`;
    const url = `${import.meta.env.VITE_API_URL}/uploads/${encodeURIComponent(
      objectName
    )}`;

    const response = await fetch(url, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`);
    }

    return { src: url };
  },
  resolve(asset) {
    return asset.props.src;
  },
};
