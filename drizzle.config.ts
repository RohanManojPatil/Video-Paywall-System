import { config } from "dotenv";
import { defineConfig } from 'drizzle-kit';

config({path:".env.local"});

export default defineConfig({
    out: './drizzle',
    dialect : "postgresql",
    schema : "./src/db/schema.ts",
    dbCredentials : {
        url : process.env.DRIZZLE_DATABASE_URL !,
    },
    verbose : true,
    strict : true,
});