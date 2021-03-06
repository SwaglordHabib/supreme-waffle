import { Context } from "https://deno.land/x/oak/mod.ts";

export async function logger(ctx: Context, next: () => Promise<void>) {
  await next();
  const responestime = ctx.response.headers.get("X-Response-Time");
  console.info(`${ctx.request.method} - ${ctx.request.url} - ${responestime}`);
}