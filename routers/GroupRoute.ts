import { decode, Payload } from "https://deno.land/x/djwt/mod.ts";
import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import { IGroup } from "../controllers/models/Group.ts";
import { GroupController } from "../controllers/GroupController.ts";
import { BadRequest } from "../helpers/BadRequest.ts";
import { NotFound } from "../helpers/NotFound.ts";
import { IPayload, jwtAuth, JwtConfig } from "../middlewares/jwt.ts";
import { GroupMemberController } from "../controllers/GroupMemberController.ts";
import { IGroupmember } from "../controllers/models/Groupmember.ts";
import { UserController } from "../controllers/UserController.ts";
import { IUser } from "../controllers/models/User.ts";
import { Unauthorized } from "../helpers/Unauthorized.ts";
import { OK } from "../helpers/OK.ts";

// instantiate our controller
const Groupcontroller = new GroupController();
const Usercontroller = new UserController();
const Groupmembercontroller = new GroupMemberController();

export function GroupRoutes(router: Router) {
  return router
    .get("/group/:id", async (ctx) => {
      if (!ctx.params.id) {
        return BadRequest(ctx);
      }

      const groupids = (
        (await Groupmembercontroller.getAllByUserID(
          ctx.params.id
        )) as unknown[] as IGroupmember[]
      ).map((item) => item.groupid);

      const groups = groupids.map(async (id) => {
        return await Groupcontroller.getOne(id);
      });

      if (groupids) {
        ctx.response.status = Status.OK;
        ctx.response.body = await Promise.all(groups);
        return;
      }

      return NotFound(ctx);
    })
    .post("/group/", async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }

      const token = ctx.request.headers
        .get(JwtConfig.header)
        ?.replace(`${JwtConfig.schema} `, "");

      if (!token) {
        return Unauthorized(ctx);
      }
      const userid = (decode(token)[1] as IPayload).id;

      const reqBody = (await ctx.request.body) as unknown as IGroup;

      const group = (await Groupcontroller.create(
        reqBody
      )) as unknown as IGroup;

      await Groupmembercontroller.create({
        role: 0,
        groupid: group.id,
        displayName: ((await Usercontroller.getOne(userid)) as unknown as IUser)
          .displayName,
      } as unknown as IGroupmember);

      return OK(ctx);
    })
    .put("/group/:id", async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }

      const reqbody = (await ctx.request.body()) as unknown as IGroupmember;

      await Groupmembercontroller.create(reqbody);

      return OK(ctx);
    })
    .post("/group/:id", async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }

      const reqbody = (await ctx.request.body()) as unknown as IGroupmember;

      await Groupmembercontroller.update(reqbody.id, reqbody);

      return OK(ctx);
    })
    .delete("/group/:id", async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }

      const reqbody = (await ctx.request.body()) as unknown as IGroupmember;

      await Groupmembercontroller.delete(reqbody.id);

      return OK(ctx);
    });
}
