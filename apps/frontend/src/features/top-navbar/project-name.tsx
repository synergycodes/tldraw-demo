import { Input } from "@synergycodes/axiom";
import { useEffect, useState } from "react";
import { useEditor } from "tldraw";
import styles from "./top-navbar.module.css";
import clsx from "clsx";

type ProjectNameProps = {
  documentName: string;
  isReadOnlyMode: boolean;
};

export const ProjectName = function ProjectName({
  documentName,
  isReadOnlyMode,
}: ProjectNameProps) {
  useEffect(() => {
    setInnerDocumentName(documentName);
  }, [documentName]);
  const editor = useEditor();
  const [editName, setEditName] = useState<boolean>(false);
  const [innerDocumentName, setInnerDocumentName] =
    useState<string>(documentName);
  const handleChangeDocumentName = () => {
    editor.updateDocumentSettings({ name: innerDocumentName || documentName });
    setInnerDocumentName(documentName);
    setEditName(false);
  };

  return (
    <div className={styles.projectSelection}>
      {(editName || !documentName) && !isReadOnlyMode ? (
        <Input
          className={styles.input}
          error={innerDocumentName.length === 0}
          value={innerDocumentName}
          onChange={(e) => {
            if (e.target.value.length > 128) return;
            setInnerDocumentName(e.target.value);
          }}
          onBlur={handleChangeDocumentName}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          autoFocus={true}
        />
      ) : (
        <span
          className={clsx([
            styles.title,
            { [styles.readOnly]: isReadOnlyMode },
          ])}
          onClick={() => {
            if (isReadOnlyMode) return;
            setEditName(true);
          }}
        >
          {documentName}
        </span>
      )}
    </div>
  );
};
