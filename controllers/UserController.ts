import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { IUser, User } from "./models/User.ts";

export class UserController {
  async create(user: IUser) {
    const passwordhash = await User.hashPassword(user.password);

    const u: IUser = { ...user, password: passwordhash };
    const userModel = await User.create(u as any);
    return User.generateJwt(userModel.id as string);
  }
  async delete(id: string) {
    await User.deleteById(id);
  }

  getOne(id: string) {
    return User.where("id", id).first();
  }

  getByEmail(email: string) {
    return User.where("email", email).all();
  }

  getByUsername(username: string) {
    return User.where("username", username).all();
  }

  async update(id: string, values: IUser) {
    await User.where("id", id).update(values as any);
    return this.getOne(id);
  }

  async login(email: string, password: string) {
    const user: User = await User.where("email", email).first();
    if (!user || !(await bcrypt.compare(password, user.password as string))) {
      return false;
    }

    return User.generateJwt(user.id as string);
  }
}
