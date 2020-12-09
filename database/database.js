import { Pool } from "../deps.js";
import { config } from "../config/config.js";

const CONCURRENT_CONNECTIONS = 4;
const connectionPool = new Pool({             // environmental variables used here, FIX
  hostname: "hattie.db.elephantsql.com",
  database: "mgphxmam",
  user: "mgphxmam",
  password: "4-ONPC-MGgR_kBaHdCaPJ0bu3iHQt1FH",
  port: 5432
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