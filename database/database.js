import { Pool } from "../deps.js";
import { config } from "../config/config.js";

const CONCURRENT_CONNECTIONS = 4;
const connectionPool = new Pool({
  hostname: config.database.hostname,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  port: Number(config.database.port)
}, CONCURRENT_CONNECTIONS);

const executeQuery = async(query, ...params) => {
    const client = await connectionPool.connect();
    try {
        return await client.query(query, ...params);
    } catch (e) {
        console.log(e);
    } finally {
        client.release();
    }
    return null;
  };

export { executeQuery };