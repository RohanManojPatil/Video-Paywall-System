import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { razorpay } from "@/lib/hooks/razorpay";
import { verifyAuth } from "@hono/auth-js";
import { z } from "zod";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { db } from "@/db/db";

const app = new Hono();

if (!process.env.RAZORPAY_SECRET) {
    throw new Error("RAZORPAY_SECRET is not defined in environment variables.");
}

app.post("/verify-payment", 
    verifyAuth(), 
    zValidator('json', z.object({
        orderId: z.string(),
        paymentId: z.string(),
        signature: z.string(),
    })),
    async (c) => {
        const session = c.get("authUser");
        const { orderId, paymentId, signature } = c.req.valid('json');

        if (!session.token?.email) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const crypt = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
        crypt.update(`${orderId}|${paymentId}`);
        const digest = crypt.digest("hex");

        const isVerified = digest === signature;

        if (!isVerified) {
            return c.json({ error: "Failed to verify payment signature" }, 400);
        }

        await db.update(users).set({ isPremium: true }).where(eq(users.email, session.token.email));

        return c.json({ success: true, data: { isVerified } }, 200);
    }
);

app.post("/create-order", 
    verifyAuth(), 
    zValidator("json", z.object({
        plainId: z.string(),
    })),
    async (c) => {
        const session = c.get("authUser");

        if (!session.token?.email) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const options = {
            amount: 999,
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,  // unique receipt ID
        };

        try {
            const order = await razorpay.orders.create(options);
            return c.json({ success: true, data: order }, 200);
        } catch (error) {
            console.error("Order creation error:", error);
            return c.json({ error: "Order creation failed" }, 500);
        }
    }
);

export default app;
