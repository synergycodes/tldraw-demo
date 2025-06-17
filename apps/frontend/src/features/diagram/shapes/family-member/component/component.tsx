import { memo } from "react";
import { FamilyMemberProps } from "../../../../palette/components/items/family";
import styles from "./component.module.css";
import { GenderFemale, GenderMale } from "@phosphor-icons/react";

type FamilyMemberShapeComponentProps = Omit<FamilyMemberProps, "fill">;

export const FamilyMemberShapeComponent = memo(
  function FamilyMemberShapeComponent({
    firstName,
    lastName,
    birthDate,
    deathDate,
    gender,
    photo,
    w,
    h,
  }: FamilyMemberShapeComponentProps) {
    return (
      <div
        className={styles.container}
        style={{ width: `${w}px`, height: `${h}px` }}
      >
        <div className={styles.body}>
          <div className={styles.imageHolder}>
            {photo ? (
              <div
                className={styles.photo}
                style={{ backgroundImage: `url("${photo}")` }}
              />
            ) : (
              <DefaultPhoto gender={gender} />
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.title}>{`${firstName} ${lastName}`}</div>
            <div className={styles.subtitle}>
              👶 {birthDate} {deathDate && `- ⚰️ ${deathDate}`}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
function DefaultPhoto({ gender }: Pick<FamilyMemberProps, "gender">) {
  return gender === "male" ? (
    <GenderMale className={styles.icon} />
  ) : (
    <GenderFemale className={styles.icon} />
  );
}
