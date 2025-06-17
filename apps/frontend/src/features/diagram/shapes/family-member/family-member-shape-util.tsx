import { HTMLContainer, Rectangle2d, ShapeUtil } from "tldraw";
import { FamilyMemberShape } from "../../../palette/components/items/family";
import { FamilyMemberShapeComponent } from "./component/component";

export class FamilyMemberShapeUtil extends ShapeUtil<FamilyMemberShape> {
  static override type = "family-member" as const;

  override getDefaultProps(): FamilyMemberShape["props"] {
    return {
      firstName: "Imię",
      lastName: "Nazwisko",
      birthDate: "10/10/1900",
      deathDate: "",
      w: 250,
      h: 60,
      gender: "male",
      photo: "",
    };
  }

  override onBeforeCreate(shape: FamilyMemberShape) {
    this.editor.select(shape);
  }

  override getGeometry(shape: FamilyMemberShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override component(shape: FamilyMemberShape) {
    const { firstName, lastName, birthDate, deathDate, gender, photo, w, h } =
      shape.props;

    return (
      <HTMLContainer
        style={{
          overflow: "hidden",
          width: shape.props.w,
          height: shape.props.h,
          pointerEvents: "all",
        }}
      >
        <FamilyMemberShapeComponent
          firstName={firstName}
          lastName={lastName}
          birthDate={birthDate}
          deathDate={deathDate}
          gender={gender}
          photo={photo}
          w={w}
          h={h}
        />
      </HTMLContainer>
    );
  }

  override indicator(shape: FamilyMemberShape) {
    return (
      <rect
        rx={12}
        ry={12}
        width={shape.props.w ?? this.getDefaultProps().w}
        height={shape.props.h ?? this.getDefaultProps().h}
      />
    );
  }

  override canResize(): boolean {
    return false;
  }
}
