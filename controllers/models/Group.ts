import { Model, DATA_TYPES } from "https://deno.land/x/denodb/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";

export interface IGroup {
  id: string;
  displayName: string;
  open: number;
  total: number;
}

export class Group extends Model {
  static table = "Group";
  static timestamps = true;
  static fields = {
    id: {
      primaryKey: true,
      type: DATA_TYPES.TEXT,
    },
    displayName: {
      type: DATA_TYPES.TEXT,
    },
    open: {
      type: DATA_TYPES.INTEGER,
      defaultValue: 0,
    },
    total: {
      type: DATA_TYPES.INTEGER,
      defaultValue: 0,
    },
  };

  static defaults = {
    id: nanoid(),
    open: 0,
    total: 0,
  };
}
