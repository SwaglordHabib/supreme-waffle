import {
  Application,
  RouteParams,
  Router,
} from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { DatabaseController } from "./controllers/Database.ts";
import { logger } from "./middlewares/logger.ts";
import {
  GroupRoutes,
  SipsRoutes,
  UserRoutes,
  ValidateRoutes,
  StatusRoutes,
} from "./routers/index.ts";

const app = new Application();
const router = new Router();

// Logger
app.use(logger);

app.use(
  oakCors({
    origin: /^.+localhost:(8080|3001)$/,
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

const routes: Router<RouteParams, Record<string, unknown>>[] = [];

routes.push(UserRoutes(router));
routes.push(GroupRoutes(router));
routes.push(SipsRoutes(router));
routes.push(ValidateRoutes(router));
routes.push(StatusRoutes(router));

routes.forEach((routes) => {
  app.use(routes.routes());
  app.use(routes.allowedMethods());
});

await new DatabaseController().initModels();

console.info("🚀 Deno start: supreme-waffle!");
await app.listen(`${Deno.env.get("IP")}:${Deno.env.get("PORT")}`);
