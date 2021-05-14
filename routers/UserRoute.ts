import { decode, Payload } from "https://deno.land/x/djwt/mod.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";
import { IUser } from "../controllers/models/User.ts";
import { UserController } from "../controllers/UserController.ts";
import { BadRequest } from "../helpers/BadRequest.ts";
import { NotFound } from "../helpers/NotFound.ts";
import { OK } from "../helpers/OK.ts";
import { jwtAuth, JwtConfig } from "../middlewares/jwt.ts";

// instantiate our controller
const controller = new UserController();

export function UserRoutes(router: Router) {
  return router
    .post("/register", async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }
      const user = (await ctx.request.body()) as unknown as IUser;

      const jwt = await controller.create(user);
      if (!jwt) {
        return BadRequest(ctx);
      }

      OK(ctx, { jwt });
    })
    .post("/signin", async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }
      const user = (await ctx.request.body()) as unknown as IUser;

      const jwt = await controller.login(user.email, user.password);
      if (!jwt) {
        return BadRequest(ctx);
      }

      OK(ctx, { jwt });
    })
    .get("/user/:id", jwtAuth, async (ctx) => {
      if (!ctx.params.id) {
        return BadRequest(ctx);
      }

      const user = await controller.getOne(ctx.params.id);
      if (user) {
        OK(ctx, { user });
        return;
      }

      return NotFound(ctx);
    })
    .get("/me", jwtAuth, async (ctx) => {
      if (!ctx.request.hasBody) {
        return BadRequest(ctx);
      }

      const token = ctx.request.headers
        .get(JwtConfig.header)
        ?.replace(`${JwtConfig.schema} `, "");

      if (token) {
        const [payload] = decode(token);

        const user = await controller.getOne((payload as Payload).id as string);

        if (user) {
          OK(ctx, { user });
          return;
        }
      }

      return NotFound(ctx);
    })
    .patch("/user/:id", jwtAuth, async (ctx) => {
      if (!ctx.request.hasBody || !ctx.params.id) {
        return BadRequest(ctx);
      }

      const userFromBody = (await ctx.request.body()) as unknown as IUser;
      const user = await controller.update(ctx.params.id, userFromBody);

      if (user) {
        OK(ctx, { user });
        return;
      }

      return NotFound(ctx);
    })
    .delete("/user/:id", async (ctx) => {
      if (!ctx.params.id) {
        return BadRequest(ctx);
      }

      await controller.delete(ctx.params.id);

      OK(ctx, { message: "OK" });
    });
}
