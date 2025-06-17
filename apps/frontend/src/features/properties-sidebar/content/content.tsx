import { TLShape } from "tldraw";
import { FamilyMemberShape } from "../../palette/components/items/family";
import { Form } from "../components/form/form";
import { StylePanel } from "../components/style-panel/style-panel";

function isFamilyMemberShape(shape: TLShape): shape is FamilyMemberShape {
  return shape.type === "family-member";
}

type ContentProps = {
  shape: TLShape | FamilyMemberShape;
  isReadOnlyMode: boolean;
};
export function Content({ shape, isReadOnlyMode }: ContentProps) {
  return isFamilyMemberShape(shape) ? (
    <Form shape={shape as FamilyMemberShape} disabled={isReadOnlyMode} />
  ) : (
    <StylePanel shape={shape} />
  );
}
