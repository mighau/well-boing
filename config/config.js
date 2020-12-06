let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
    config.database = {};
} else {
    config.database = {
        hostname: "hattie.db.elephantsql.com",
        database: "mgphxmam",
        user: "mgphxmam",
        password: "SUuymvsozepafJZjQx_epu7a_SjMKCVs",
        port: 5432
    };
}

export { config };