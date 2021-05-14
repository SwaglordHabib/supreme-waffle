import { Model, DATA_TYPES } from "https://deno.land/x/denodb/mod.ts";
import { FieldProps } from "https://deno.land/x/denodb/lib/data-types.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";

export interface IGroupmember {
  id: string;
  role: number;
  displayName: string;
  open: number;
  total: number;
  groupid: string;
}

export class Groupmember extends Model {
  static table = "Groupmember";
  static timestamps = true;
  static fields = {
    id: {
      primaryKey: true,
      type: DATA_TYPES.TEXT,
    } as FieldProps,
    role: {
      type: DATA_TYPES.INTEGER,
    },
    userID: {
      type: DATA_TYPES.TEXT,
    } as FieldProps,
    open: {
      type: DATA_TYPES.INTEGER,
      defaultValue: 0,
    } as FieldProps,
    total: {
      type: DATA_TYPES.INTEGER,
      defaultValue: 0,
    } as FieldProps,
    groupID: {
      type: DATA_TYPES.TEXT,
    } as FieldProps,
  };

  static defaults = {
    id: nanoid(),
    open:0,
    total:0
  };
}
