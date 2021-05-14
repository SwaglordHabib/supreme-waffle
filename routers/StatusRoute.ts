import { Router } from "https://deno.land/x/oak/mod.ts";
import { OK } from "../helpers/OK.ts";

export function StatusRoutes(router: Router) {
  return router.get("/status", (ctx) => {
    OK(ctx, { status: "ok" });
  });
}
