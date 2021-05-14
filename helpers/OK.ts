import {
  RouteParams,
  RouterContext,
  Status,
} from "https://deno.land/x/oak/mod.ts";

export function OK(
  ctx: RouterContext<RouteParams, Record<string, unknown>>,
  body?: any 
) {
  ctx.response.status = Status.OK;
  ctx.response.body = body || null;
}
