import { useEffect, useState } from "react";
import { Input } from "@synergycodes/axiom";
import styles from "./photo.module.css";
import control from "../control.module.css";
import { X } from "@phosphor-icons/react";
import clsx from "clsx";
import { FamilyMemberShape } from "../../../../../palette/components/items/family";
import { Spinner } from "../../../../../../components/spinner/spinner";

async function isValidImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

type Props = FamilyMemberShape["props"];

type PhotoControlProps<K extends keyof Props> = {
  shape: FamilyMemberShape;
  prop: K;
  label?: string;
  onCommit: (
    key: keyof Props,
    value: unknown,
    currentShape: FamilyMemberShape
  ) => void;
  disabled: boolean;
};

export function PhotoControl<K extends keyof Props>({
  shape,
  prop,
  label,
  onCommit,
  disabled = false,
}: PhotoControlProps<K>) {
  const [value, setValue] = useState(shape.props[prop] as string);
  const [currentShape, setCurrentShape] = useState<FamilyMemberShape>(shape);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(shape.props[prop] as string);
    setCurrentShape(shape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape]);

  const handleBlur = async () => {
    if (!value) return onCommit(prop, value, currentShape);
    setIsLoading((prev) => !prev);

    const valid = await isValidImageUrl(value).finally(() =>
      setIsLoading((prev) => !prev)
    );
    setIsValid(valid);

    if (!valid) {
      console.error("Invalid image URL:", value);
      return;
    }

    onCommit(prop, value, currentShape);
  };

  return (
    <label className={control.container}>
      <span className={styles.label}>{label}</span>
      <Input
        className={clsx(styles.input, {
          [styles.disabled]: disabled,
          [styles.error]: !isValid,
        })}
        disabled={disabled || isLoading}
        error={!isValid}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        onFocus={() => setIsValid(true)}
        type="text"
        endAdornment={
          isLoading ? (
            <Spinner />
          ) : (
            value && (
              <X
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("");
                }}
                style={{
                  cursor: "pointer",
                  fontSize: "15px",
                  height: "1em",
                  width: "1em",
                }}
              />
            )
          )
        }
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setIsValid(true);
        }}
        onBlur={handleBlur}
        placeholder={`${label}...`}
      />
      {!isValid && <div className={styles.helperText}>Invalid photo url!</div>}
    </label>
  );
}
