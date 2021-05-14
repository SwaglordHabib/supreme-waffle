import { IGroup, Group } from "./models/Group.ts";

export class GroupController {
  async create(group: IGroup) {

    const u: IGroup = { ...group };
    const GroupModel = await Group.create(u as any);
    return GroupModel;
  }

  async delete(id: string) {
    await Group.deleteById(id);
  }

  getOne(id: string) {
    return Group.where("id", id).first();
  }

  async update(id: string, values: IGroup) {
    await Group.where("id", id).update(values as any);
    return this.getOne(id);
  }
}
