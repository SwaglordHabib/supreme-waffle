import { Model, DATA_TYPES } from "https://deno.land/x/denodb/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { Payload, create, Header } from "https://deno.land/x/djwt/mod.ts";
import { JwtConfig } from "../../middlewares/jwt.ts";

export interface IUser {
  id: string;
  displayName: string;
  password: string;
  email: string;
  image: string;
  open: number;
  total: number;
}

export class User extends Model {
  static table = "User";
  static timestamps = true;
  static fields = {
    id: {
      primaryKey: true,
      type: DATA_TYPES.TEXT,
    },
    password: {
      type: DATA_TYPES.TEXT,
    },
    displayName: {
      type: DATA_TYPES.TEXT,
    },
    email: {
      type: DATA_TYPES.TEXT,
    },
    image: {
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
    open:0,
    total:0
  };

  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(8);
    return bcrypt.hash(password, salt);
  }

  static generateJwt(id: string) {
    // Create the payload with the expiration date (token have an expiry date) and the id of current user (you can add that you want)
    const payload: Payload = {
      id,
      exp: new Date().getTime() + JwtConfig.expirationTime,
    };
    const header: Header = {
      alg: JwtConfig.alg as Header["alg"],
      typ: JwtConfig.type,
    };

    // return the generated token
    return create(header, payload, JwtConfig.secretKey);
  }
}
