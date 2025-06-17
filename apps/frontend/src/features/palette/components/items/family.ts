import { TLBaseShape } from "tldraw";

export type FamilyMemberShape = TLBaseShape<
  "family-member",
  {
    firstName: string;
    lastName: string;
    birthDate: string;
    deathDate: string;
    w: number;
    h: number;
    gender: "male" | "female";
    photo?: string;
  }
>;

export interface FamilyTree {
  members: FamilyMemberShape[];
}

export type FamilyMemberProps = FamilyMemberShape["props"];
