import {
  RouteParams,
  RouterContext,
  Status,
} from "https://deno.land/x/oak/mod.ts";

export function Unauthorized(ctx: RouterContext<RouteParams, Record<string, any>>) {
  ctx.response.status = Status.Unauthorized;
  ctx.response.body = [];
}
