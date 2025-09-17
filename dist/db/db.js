"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const port = process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432;
const pool = new pg_1.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port,
});
exports.default = pool;
