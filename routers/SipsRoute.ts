import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import { IUser } from "../controllers/models/User.ts";
import { UserController } from "../controllers/UserController.ts";
import { GroupController } from "../controllers/GroupController.ts";
import { GroupMemberController } from "../controllers/GroupMemberController.ts";
import { BadRequest } from "../helpers/BadRequest.ts";
import {
  IGroupmember,
} from "../controllers/models/Groupmember.ts";
import { OK } from "../helpers/OK.ts";

// instantiate our Usercontroller
const Usercontroller = new UserController();
const Groupcontroller = new GroupController();
const Groupmembercontroller = new GroupMemberController();

interface ISip {
  /**
   * this is the UserID
   */
  id: string;
  /**
   * The ID of the Group
   */
  groupid: string;
  /**
   * Defines how many shoots getting added or deleted
   */
  count: number;
}

export function SipsRoutes(router: Router) {
  return router
    .get("/sips/add", async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }
      const reqbody = (await ctx.request.body()) as unknown as ISip;

      const groupmember = (await Groupmembercontroller.getOnebyUserIDAndGroupID(
        reqbody.id,
        reqbody.groupid
      )) as unknown as IGroupmember;

      const user = (await Usercontroller.getOne(
        reqbody.id
      )) as unknown as IUser;

      const group = (await Groupcontroller.getOne(
        reqbody.groupid
      )) as unknown as IGroupmember;

      const gmcu = Groupmembercontroller.update(groupmember.id, {
        ...groupmember,
        open: groupmember.open + reqbody.count,
      });

      const gmu = Groupcontroller.update(reqbody.groupid, {
        ...group,
        open: group.open + reqbody.count,
      });

      const uu = Usercontroller.update(user.id, {
        ...user,
        open: user.open + reqbody.count,
      });

      await Promise.all([gmcu, gmu, uu]);

      OK(ctx);
    })
    .get("/sips/done", async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }
      const reqbody = (await ctx.request.body()) as unknown as ISip;

      const groupmember = (await Groupmembercontroller.getOnebyUserIDAndGroupID(
        reqbody.id,
        reqbody.groupid
      )) as unknown as IGroupmember;

      const user = (await Usercontroller.getOne(
        reqbody.id
      )) as unknown as IUser;

      const group = (await Groupcontroller.getOne(
        reqbody.groupid
      )) as unknown as IGroupmember;

      const gmcu = Groupmembercontroller.update(groupmember.id, {
        ...groupmember,
        total: user.total + reqbody.count,
        open: groupmember.open + reqbody.count,
      });

      const gmu = Groupcontroller.update(reqbody.groupid, {
        ...group,
        total: user.total + reqbody.count,
        open: group.open + reqbody.count,
      });

      const uu = Usercontroller.update(user.id, {
        ...user,
        total: user.total + reqbody.count,
        open: user.open - reqbody.count,
      });

      await Promise.all([gmcu, gmu, uu]);

      OK(ctx);
    });
}
