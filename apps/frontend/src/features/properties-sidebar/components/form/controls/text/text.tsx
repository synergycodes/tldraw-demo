import { useEffect, useRef, useState } from "react";
import { FamilyMemberShape } from "../../../../../palette/components/items/family";
import { Input } from "@synergycodes/axiom";
import styles from "./text.module.css";
import control from "../control.module.css";
import { X } from "@phosphor-icons/react";
import clsx from "clsx";

type Props = FamilyMemberShape["props"];

type TextContolProps<K extends keyof Props> = {
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

function parseValue<K extends keyof Props>(key: K, raw: string): Props[K] {
  const numericKeys: (keyof Props)[] = ["w", "h"];

  if (numericKeys.includes(key)) {
    return Number(raw) as Props[K];
  }

  return raw as Props[K];
}

export function TextContol<K extends keyof Props>({
  shape,
  prop,
  label,
  onCommit,
  disabled,
}: TextContolProps<K>) {
  const [value, setValue] = useState<Props[K]>(shape.props[prop]);
  const [currentShape, setCurrentShape] = useState<FamilyMemberShape>(shape);
  const inputRef = useRef<HTMLInputElement>(null);
  const isNumberInput = typeof value === "number" ? true : false;

  useEffect(() => {
    setValue(shape.props[prop]);
    setCurrentShape(shape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape]);

  const handleBlur = () => {
    if (value?.toString().length === 0 && prop === "firstName") {
      return setValue(shape.props[prop]);
    }
    onCommit(prop, value, currentShape);
  };

  return (
    <>
      <label className={control.container}>
        <span className={styles.label}>{label ?? prop}</span>
        <Input
          ref={inputRef}
          className={clsx(styles.input, { [styles.disabled]: disabled })}
          disabled={disabled}
          error={prop === "firstName" && value === ""}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.currentTarget.blur();
          }}
          type={isNumberInput ? "number" : "text"}
          endAdornment={
            value && (
              <X
                onClick={() => setValue(parseValue(prop, ""))}
                style={{
                  cursor: "pointer",
                  fontSize: "15px",
                  height: "1em",
                  width: "1em",
                }}
              />
            )
          }
          value={value}
          onChange={(e) => {
            setValue(e.target.value as Props[K]);
          }}
          onBlur={handleBlur}
          placeholder={`${label}...`}
        />
      </label>
    </>
  );
}
