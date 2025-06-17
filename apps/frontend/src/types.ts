import { FamilyMemberProps } from "./features/palette/components/items/family";

export interface NodeData extends FamilyMemberProps {
  key: number;
  parent: number;
}

export type LinkData = {
  from: number;
  to: number;
};
