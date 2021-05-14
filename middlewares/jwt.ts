import { Context, Status } from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt/mod.ts";
import { Algorithm } from "https://deno.land/x/djwt/algorithm.ts";

interface IJwtConfig {
  header: string;
  schema: string;
  secretKey: string;
  expirationTime: number;
  type: string;
  alg: Algorithm;
}

export interface IPayload {
  id: string;
  exp: number;
}

/**
 * Create a default configuration
 */
export const JwtConfig: IJwtConfig = {
  header: "Authorization",
  schema: "Bearer",
  // use Env variable
  secretKey: Deno.env.get("SECRET") || "",
  expirationTime: 60000,
  type: "JWT",
  alg: "HS256",
};

export async function jwtAuth(
  ctx: Context<Record<string, any>>,
  next: () => Promise<void>
) {
  // Get the token from the request
  const token = ctx.request.headers
    .get(JwtConfig.header)
    ?.replace(`${JwtConfig.schema} `, "");

  // reject request if token was not provide
  if (!token) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  // check the validity of the token
  if (!(await verify(token, JwtConfig.secretKey, JwtConfig.alg))) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: "Wrong Token" };
    return;
  }

  // JWT is correct, so continue and call the private route
  next();
}
