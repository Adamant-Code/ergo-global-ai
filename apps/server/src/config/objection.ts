import "dotenv/config";
import knex from "knex";
import { Model } from "objection";
import knexConfig from "../../knex/knexfile.js";

const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];
const db = knex.default(config);

Model.knex(db);

export default db;
