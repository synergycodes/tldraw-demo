import { track, useEditor } from "tldraw";
import styles from "./top-navbar.module.css";
import { Toolbar } from "./toolbar";
import { Controls } from "./controls";
import { ProjectName } from "./project-name";
import { useImportExport } from "./hooks/use-export-import";
import { PERSISTENCE_KEY } from "../../consts";
import { showSnackbar } from "../../utils/show-snackbar";

export const TopNavbar = track(function TopNavbar() {
  const editor = useEditor();
  const { onExport, onImport, onExportAsImage } = useImportExport();
  const documentName = editor.getDocumentSettings().name;
  const isReadOnlyMode = editor.getIsReadonly();
  const mode = localStorage.getItem('mode')
  const onToggleReadOnly = () => {
    editor.updateInstanceState({ isReadonly: !isReadOnlyMode });
  };

  const undo = () => editor.undo();
  const redo = () => editor.redo();

  const canUndo = editor.getCanUndo();

  const canRedo = editor.getCanRedo();

  const handleSave = () => {
    const data = editor.getSnapshot();
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(data));
    showSnackbar({ title: "Successfully Saved!", variant: "success" });
  };
  return (
    <div className={styles.topNavbar}>
      <div className={styles.container}>
        <Toolbar
          onSave={handleSave}
          onOpen={onImport}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <ProjectName
          documentName={documentName}
          isReadOnlyMode={isReadOnlyMode}
        />
        <div className={styles.rightToolbarBox}>
          <Controls
            onExport={onExport}
            onImport={onImport}
            onToggleReadOnly={onToggleReadOnly}
            isReadOnlyMode={isReadOnlyMode}
            onExportAsImage={onExportAsImage}
            mode={mode as "local" | "remote" | "sync-demo"}
          />
        </div>
      </div>
    </div>
  );
});
