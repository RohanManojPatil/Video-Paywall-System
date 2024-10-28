import { db } from "@/db/db";
import { users } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import {eq} from "drizzle-orm";

const app = new Hono()
.get('/is-premium',
    verifyAuth(),
    async(c) => {
        const session  = c.get("authUser");
        const routes = app.use("/routes");
        if(!session.token?.email){
            return c.json({error : "unAuthorized"}, 401);
        }

        const [user] = await db.select().from(users).where(eq(users.email, session.token.email));

        if(!user)
        {
            return c.json({error:"user not found"}, 404);
        }

        if(!user.isPremium)
        {
            return c.json({isPremium:false});
        }
        else
        {
            return c.json({isPremium:true});
        }
    }
)

export default app;