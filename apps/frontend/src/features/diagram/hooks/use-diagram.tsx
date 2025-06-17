import {
  TLBookmarkAsset,
  AssetRecordType,
  getHashForString,
  Editor,
  TLGridProps,
} from "tldraw";
import { PERSISTENCE_KEY } from "@/consts";
import * as defaultModel from "@/default-model.json";
import { Background } from "../background/background";
import { Loader } from "@/layout/loader/loader";
import { Grid } from "../grid/grid";

const components = {
  Background: Background,
  ActionsMenu: null,
  MenuPanel: null,
  QuickActions: null,
  LoadingScreen: Loader,
  StylePanel: null,
  SharePanel: null,
  Grid: (camera: TLGridProps) => Grid(camera),
};

export function useDiadram(mode: "local" | "remote" | "sync-demo") {
  localStorage.setItem('mode', mode)
  const handleMount = (editor: Editor) => {
    window.editor = editor;
    editor.updateInstanceState({ isGridMode: true });
    
    if (mode === "remote")
      editor.registerExternalAssetHandler("url", unfurlBookmarkUrl);

    if (editor.getCurrentPageShapeIds().size > 0 || mode !== 'local') return;
    const initialData = localStorage.getItem(PERSISTENCE_KEY);
    const parsed = initialData ? JSON.parse(initialData) : defaultModel;
    const snapshot = {
      document: {
        store: parsed.document.store,
        schema: parsed.document.schema,
      },
      session: parsed.session,
    };
    editor.loadSnapshot(snapshot);
  };

  return {
    handleMount,
    components,
  };
}

async function unfurlBookmarkUrl({
  url,
}: {
  url: string;
}): Promise<TLBookmarkAsset> {
  const asset: TLBookmarkAsset = {
    id: AssetRecordType.createId(getHashForString(url)),
    typeName: "asset",
    type: "bookmark",
    meta: {},
    props: {
      src: url,
      description: "",
      image: "",
      favicon: "",
      title: "",
    },
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/unfurl?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();

    asset.props.description = data?.description ?? "";
    asset.props.image = data?.image ?? "";
    asset.props.favicon = data?.favicon ?? "";
    asset.props.title = data?.title ?? "";
  } catch (e) {
    console.error(e);
  }

  return asset;
}
