import { Model, DATA_TYPES } from "https://deno.land/x/denodb/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";

export interface IGroup {
  id: string;
  friendid: string;
  userid: string;
}

export class Friend extends Model {
  static table = "Group";
  static timestamps = true;
  static fields = {
    id: {
      primaryKey: true,
      type: DATA_TYPES.TEXT,
    },
    friendid: {
      type: DATA_TYPES.TEXT,
    },
    userid: {
      type: DATA_TYPES.TEXT,
    },
  };

  static defaults = {
    id: nanoid(),
  };
}
