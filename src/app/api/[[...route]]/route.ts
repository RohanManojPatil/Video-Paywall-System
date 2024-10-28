import { Context, Hono } from 'hono'
import { handle } from 'hono/vercel'
import {AuthConfig, initAuthConfig } from '@hono/auth-js';
import authConfig from '@/auth.config';
import userRoutes from '@/app/api/[[...route]]/user';
import paymentsRoute from "@/app/api/[[...route]]/payments"
import videoRoutes from "@/app/api/[[...route]]/videos";
export const runtime = 'nodejs'

function getAuthConfig(c:Context) : AuthConfig {
    return {
        secret : c.env.AUTH_SECRET,
        ...authConfig
    }
}
const app = new Hono().basePath('/api')

app.use("*", initAuthConfig(getAuthConfig))

const routes = app.route('/user', userRoutes).route("/payments", paymentsRoute)
.route("/video", videoRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes 