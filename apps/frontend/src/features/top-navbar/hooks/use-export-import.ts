import {
  useEditor,
  TLEditorSnapshot,
  loadSnapshot,
  getSnapshot,
  Editor,
} from "tldraw";
import createModelWithElk from "../../../utils/create-model-with-elk";
import { NodeData } from "../../../types";
import { PERSISTENCE_KEY } from "../../../consts";
import { showSnackbar } from "../../../utils/show-snackbar";

type Dataset = {
  nodeDataArray: NodeData[];
};

export const useImportExport = () => {
  const editor = useEditor();

  const validateSnapshot = (data: unknown): data is TLEditorSnapshot => {
    if (
      typeof data !== "object" ||
      data === null ||
      !("document" in data) ||
      !("session" in data)
    ) {
      return false;
    }
    try {
      loadSnapshot(editor.store, data as Partial<TLEditorSnapshot>);
      return true;
    } catch {
      return false;
    }
  };

  const validateDataset = (data: unknown): data is Dataset => {
    if (
      typeof data !== "object" ||
      data === null ||
      !("nodeDataArray" in data) ||
      !Array.isArray((data as Dataset).nodeDataArray)
    ) {
      return false;
    }

    const array = (data as Dataset).nodeDataArray;
    for (const node of array) {
      if (
        typeof node !== "object" ||
        node === null ||
        ("key" in node && typeof node.key !== "number") ||
        ("parent" in node && typeof node.parent !== "number") ||
        ("firstName" in node && typeof node.firstName !== "string") ||
        ("parent" in node && typeof node.parent !== "number") ||
        ("photo" in node && typeof node.photo !== "string") ||
        ("reign" in node && typeof node.reign !== "string") ||
        ("birthDate" in node && typeof node.birthDate !== "string") ||
        ("deathDate" in node && typeof node.deathDate !== "string") ||
        ("gender" in node && typeof node.gender !== "string") ||
        ("w" in node && typeof node.w !== "number") ||
        ("h" in node && typeof node.h !== "number")
      ) {
        return false;
      }
    }

    return true;
  };

  const importModel = (event: Event) => {
    const input = event.target as HTMLInputElement | null;

    if (input && input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const result = e.target?.result;
        if (typeof result === "string") {
          try {
            const parsed = JSON.parse(result);
            if (validateSnapshot(parsed)) {
              importRegularModel(editor, parsed);
            } else if (validateDataset(parsed)) {
              editor.updateDocumentSettings({
                name: file.name.replace(/.json/, ""),
              });
              importFromGeneralDataset(editor, parsed);
            } else {
              throw new Error("Invalid model!");
            }
            showSnackbar({
              title: "File Imported Successfully!",
              variant: "success",
            });
          } catch (e) {
            console.error(e);
            showSnackbar({ title: "Some Error Occured!", variant: "error" });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return {
    onExport: async () => {
      try {
        const name = editor.getDocumentSettings().name;
        const { document: TLdocument, session: TLsession } = getSnapshot(
          editor.store
        );
        const blob = new Blob(
          [
            JSON.stringify(
              { document: TLdocument, session: TLsession },
              null,
              2
            ),
          ],
          {
            type: "application/json",
          }
        );

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${name || "model"}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        showSnackbar({
          title: "File Exported Successfully!",
          variant: "success",
        });
      } catch (e) {
        console.error(e);
        showSnackbar({ title: "Some Error Occured!", variant: "error" });
      }
    },

    onExportAsImage: async () => {
      try {
        const shapeIds = editor.getCurrentPageShapeIds();
        const name = editor.getDocumentSettings().name;
        if (shapeIds.size === 0)
          return console.error("No shapes on the canvas");
        const { blob } = await editor.toImage([...shapeIds], {
          format: "png",
          background: false,
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${name || "model"}.png`;
        link.click();
        URL.revokeObjectURL(link.href);
        showSnackbar({
          title: "File Exported Successfully!",
          variant: "success",
        });
      } catch (e) {
        console.error(e);
        showSnackbar({ title: "Some Error Occured!", variant: "error" });
      }
    },

    onImport: () => {
      const dynamicInputEl = document.createElement("input");
      dynamicInputEl.type = "file";
      dynamicInputEl.accept = ".json";
      dynamicInputEl.addEventListener("change", importModel, { once: true });
      dynamicInputEl.click();
    },
  };
};

function importRegularModel(editor: Editor, parsed: TLEditorSnapshot) {
  const snapshot = {
    document: {
      store: parsed.document.store,
      schema: parsed.document.schema,
    },
    session: parsed.session,
  };
  editor.loadSnapshot(snapshot);
  editor.clearHistory();
  localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(parsed));
}

async function importFromGeneralDataset(editor: Editor, parsed: Dataset) {
  const allShapes = editor.getCurrentPageShapes();
  editor.deleteShapes(allShapes.map((shape) => shape.id));
  const nodeDataArray = parsed.nodeDataArray;
  const linkDataArray = nodeDataArray
    .filter((member) => member.parent !== undefined)
    .map(({ key, parent }) => ({
      from: parent,
      to: key,
      parent: "parent",
      child: "child",
    }));

  const data = await createModelWithElk(editor, nodeDataArray, linkDataArray);
  localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(data));
}
