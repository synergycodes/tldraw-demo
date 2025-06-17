import { DatePicker } from "@synergycodes/axiom";
import { FamilyMemberShape } from "../../../../../palette/components/items/family";
import { format, parse, isValid } from "date-fns";
import styles from "./date.module.css";
import { useEffect, useState } from "react";

type Props = FamilyMemberShape["props"];

type DateControlProps<K extends keyof Props> = {
  shape: FamilyMemberShape;
  prop: K;
  label: string;
  minDate?: string;
  maxDate?: string;
  onCommit: (key: K, value: Props[K], currentShape?: FamilyMemberShape) => void;
  disabled: boolean;
};

function getDate(date: string | undefined) {
  const parsedValue =
    typeof date === "string" && date !== ""
      ? parse(date, "dd/MM/yyyy", new Date())
      : undefined;

  const safeValue = isValid(parsedValue) ? parsedValue : undefined;
  return safeValue;
}

export function DateControl<K extends keyof Props>({
  shape,
  prop,
  label,
  minDate,
  maxDate,
  onCommit,
  disabled,
}: DateControlProps<K>) {
  const [date, setDate] = useState(shape.props[prop] as string);

  useEffect(() => {
    setDate(shape.props[prop] as string);
  }, [prop, shape]);

  return (
    <div className={styles.dateInput}>
      <label className={styles.label}>{label}</label>
      <DatePicker
        key={date}
        className={styles.date}
        placeholder="dd/mm/rrrr"
        minDate={getDate(minDate)}
        maxDate={getDate(maxDate)}
        value={getDate(date)}
        disabled={disabled}
        onChange={(date) => {
          if (date instanceof Date && isValid(date)) {
            const formatted = format(date, "dd/MM/yyyy");
            onCommit(prop, formatted as Props[K]);
          } else {
            onCommit(prop, "" as Props[K]);
          }
        }}
      />
    </div>
  );
}
