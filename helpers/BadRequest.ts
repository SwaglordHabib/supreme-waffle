import {
  RouteParams,
  RouterContext,
  Status,
} from "https://deno.land/x/oak/mod.ts";

export function BadRequest(
  ctx: RouterContext<RouteParams, Record<string, any>>
) {
  ctx.response.status = Status.BadRequest;
  ctx.response.body = "BadRequest";
}
