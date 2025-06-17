import { useUpdateShape } from "../../../../hooks/use-update-shape";
import { FamilyMemberShape } from "../../../palette/components/items/family";
import { DateControl } from "./controls/date/date";
import { PhotoControl } from "./controls/photo/photo";
import { TextContol } from "./controls/text/text";
import styles from "./form.module.css";

type Props = {
  shape: FamilyMemberShape;
  disabled: boolean;
};

export function Form({ shape, disabled }: Props) {
  const { updateProp } = useUpdateShape();
  const handleCommit = (
    key: keyof (typeof shape)["props"],
    value: unknown,
    currentShape?: FamilyMemberShape
  ) => {
    updateProp(currentShape ?? shape, key, value);
  };
  return (
    <form className={styles.container}>
      <TextContol
        shape={shape}
        prop={"firstName"}
        label="First Name"
        onCommit={handleCommit}
        disabled={disabled}
      />
      <TextContol
        shape={shape}
        prop="lastName"
        label="Last Name"
        onCommit={handleCommit}
        disabled={disabled}
      />
      <DateControl
        shape={shape}
        prop="birthDate"
        label="Birth Date"
        maxDate={shape.props.deathDate}
        onCommit={handleCommit}
        disabled={disabled}
      />
      <DateControl
        shape={shape}
        prop="deathDate"
        label="Death Date"
        minDate={shape.props.birthDate}
        onCommit={handleCommit}
        disabled={disabled}
      />
      <PhotoControl
        shape={shape}
        label="Photo"
        prop="photo"
        onCommit={handleCommit}
        disabled={disabled}
      />
    </form>
  );
}
