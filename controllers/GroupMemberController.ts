import { IGroupmember, Groupmember } from "./models/Groupmember.ts";

export class GroupMemberController {
  async create(groupmember: IGroupmember) {
    const u: IGroupmember = { ...groupmember };
    const gm = await Groupmember.create(u as any);
    return Groupmember;
  }

  async delete(id: string) {
    await Groupmember.deleteById(id);
  }

  getOnebyUserIDAndGroupID(userid: string, groupid: string) {
    return Groupmember.where("UserID", userid)
      .where("GroupID", groupid)
      .first();
  }
  getAllByUserID(userid:string){
    return Groupmember.where("UserID",userid).all();
  }

  getOne(id: string) {
    return Groupmember.where("ID", id).first();
  }

  async update(id: string, values: IGroupmember) {
    await Groupmember.where("id", id).update(values as any);
    return this.getOne(id);
  }
}
