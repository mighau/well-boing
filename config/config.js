import "https://deno.land/x/dotenv/load.ts";


let config = {};
config.database = {
    hostname: Deno.env.get('PGHOST'),
    database: Deno.env.get('PGDATABASE'),
    user: Deno.env.get('PGDATABASE'),
    password: Deno.env.get('PGPASSWORD'),
    port: Deno.env.get('PGPORT')
};


export { config };