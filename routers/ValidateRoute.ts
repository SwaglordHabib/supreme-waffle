import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import { UserController } from "../controllers/UserController.ts";
import { BadRequest } from "../helpers/BadRequest.ts";
import { OK } from "../helpers/OK.ts";

// instantiate our controller
const controller = new UserController();

export function ValidateRoutes(router: Router) {
  return router
    .get("/validate/Email/:email", async (ctx) => {
      if (!ctx.params.email) {
        return BadRequest(ctx);
      }

      const users = await controller.getByEmail(ctx.params.email);

      if (!users) {
        OK(ctx, { valid: "valid" });
        return;
      }

      OK(ctx, { valid: "Nonvalid" });
    })
    .get("/validate/User/:username", async (ctx) => {
      if (!ctx.params.username) {
        return BadRequest(ctx);
      }
      const users = await controller.getByUsername(ctx.params.username);

      if (!users) {
        OK(ctx, { valid: "valid" });
        return;
      }

      OK(ctx, { valid: "Nonvalid" });
    });
}
