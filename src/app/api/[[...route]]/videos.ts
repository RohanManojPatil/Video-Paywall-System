import { db } from '@/db/db';
import { users } from '@/db/schema';
import { signStreamURL } from '@/lib/hooks/signed-stream-url';
import { verifyAuth } from '@hono/auth-js';
import { zValidator } from '@hono/zod-validator';
import {Hono} from 'hono';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
const app = new Hono()
    .get('/get-signed-url',
        verifyAuth(), 
        zValidator("query", z.Object({
            iFrameUrl : zValidator.toString()
        }),
),async (c) =>{
    const session = c.get("authUser");
    const {iFrameURL} = c.req.valid('query');  
    if (!session.token?.email) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    
    const user = await db.select().from(users).where(eq(users.email, session.token.email))

    if(user.length === 0){
        return c.json({error : "user not found"}, 404);
    }

    if(user[0].isPremium === false)
    {
        return c.json({error:"user is not premium"}, 403);
    }
    const signedUrl = signStreamURL(iFrameURL, process.env.BUNNY_CDN);

    if(!signedUrl)
    {
        return c.json({data : "error in signing Url"}, 400);
    }
    return c.json({data : signedUrl}, 200);
}
);

export default app;
