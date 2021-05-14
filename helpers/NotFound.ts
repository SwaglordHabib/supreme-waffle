import {
  RouteParams,
  RouterContext,
  Status,
} from "https://deno.land/x/oak/mod.ts";

export function NotFound(ctx: RouterContext<RouteParams, Record<string, any>>) {
  ctx.response.status = Status.NotFound;
  ctx.response.body = [];
}
